# **Lab: Exploiting an API endpoint using documentation**

 To solve the lab, find the exposed API documentation and delete `carlos`. You can log in to your own account using the following credentials: `wiener:peter`. 

 # **Solution**


Trước tiên, ta đăng nhập với thông tin đăng nhập được cung cấp: `wiener:peter`.  

Sau khi đăng nhập thành công, ta thấy có chức năng cập nhật email.  
Thường thì các api CRUD liên quan tới người dùng đều chung một path api cha.  

Thực hiện cập nhật một email mới bất kì.

Sau khi cập nhật email, trong giao diện Burpsuite, ta thấy có một request có api là: `/api/user/wiener` với method `PATCH`. Gửi request này tới Repeater

`PATCH` hơi giống với khái niệm "cập nhật" trong CRUD (nói chung, HTTP khác với CRUD và không nên nhầm lẫn cả hai).  

Ta thấy có thông tin `users` trong api trên, ta xóa `wiener` trong api và gửi request.

Ta nhận được thông báo lỗi:

```
{
    "error":"Malformed URL: expecting an identifier"
}
```

Lỗi này do trong qpi request chúng ta gửi tới không có thông tin định danh `user`. Tiếp tục xóa `user` trong api.

```
HTTP/2 302 Found
Location: /api/
X-Frame-Options: SAMEORIGIN
Content-Length: 0
```

Lần này ta thấy response code là 302. Do request vẫn đang dùng method `PATCH`. Đổi lại method GET để lấy responese thì ta thu được http res chứa các api liên quan tới user.

Truy cập trên browsers và cập nhật giá trị `username` trong api `DELETE` rồi gửi resquest.  

Done  :)

![image](https://i.chzbgr.com/full/9714683136/hA3DAE5C2/cat-fully-charged)