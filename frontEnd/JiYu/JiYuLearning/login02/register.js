//点击"注册"按钮之后，实现注册功能：
function btn_register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if(username==''){
        alert('用户名不能为空!');
        return;
    }
    if(password==''){
        alert('密码不能为空!');
        return;
    }
    // 检查密码是否一致
    if (password!== confirmPassword) {
        alert('两次输入的密码不一致，请重新输入！');
        return;
    }
    // 创建一个 User 对象
    const user = {
        username: username,
        password: password
    };

    // 发送注册请求
    fetch('http://localhost:8080/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 1) {
                alert('注册成功');
                // 跳转到登录页面
                window.location.href = './login.html';
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('注册请求出错:', error);
        });
}