# **Lab: SQL injection UNION attack, determining the number of columns returned by the query**
>  This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response, so you can use a UNION attack to retrieve data from other tables. The first step of such an attack is to determine the number of columns that are being returned by the query. You will then use this technique in subsequent labs to construct the full attack.<br>
 To solve the lab, determine the number of columns returned by the query by performing a SQL injection UNION attack that returns an additional row containing null values. 

# **Solution**
Chọn một trang áp dụng bộ lọc bất kì của trang. Ở đây chọn trang `Gifts`
> https://0a9200c50332833881729362005e00aa.web-security-academy.net/filter?category=Gifts

Có thể đoán được câu truy vấn trong trường hợp này sẽ là:
```
SELECT <some columns> FROM <table name> WHERE <columns name> = 'Gifts'
```
OR
```
SELECT <some columns> FROM 'Gifts'
```
Dựa theo suy đoán trên, thử dùng ONION để xác định số lượng cột được truy vấn:
```
' UNION SELECT NULL -- 
```
Thêm đoạn mã trên vào phần URL để chèn vào câu truy vấn đoạn mã UNION.
Khi đó câu truy vấn sẽ là:
```
SELECT <some columns> FROM 'Gift' UNION SELECT NULL -- ...
```
Nếu có báo lỗi như:
> Internal Server Error

thì nghĩa là số giá trị NULL không khớp với số cột trong câu truy vấn. Chúng ta chỉ cần tăng dần số lượng NULL trong UNION đến khi web không còn báo lỗi như trên.
```
' UNION SELECT NULL,NULL,NULL -- 
```
Done, vậy là 3 giá trị NULL ứng với 3 cột. Đúng như yêu cầu đề bài thì sẽ xuất hiện thêm một hàng trống trên web.


![image](https://i.pinimg.com/originals/5f/39/e6/5f39e6d606da1c3d603bdabfccf053f3.jpg)