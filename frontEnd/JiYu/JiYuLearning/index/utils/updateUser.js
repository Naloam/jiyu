//点击"确认"按钮之后，实现更新用户信息功能：
function updateUserInfo() {
    // 获取用户信息
    getIdByUsername();
    const id = localStorage.getItem('id');//后端更新是根据id来更新的，故id为必须值
    const name = localStorage.getItem('name');
    const password = localStorage.getItem('password');
    const level = localStorage.getItem('level');

    // 创建一个 User 对象
    const user = {
        id: id,
        username: name,
        password: password,
        level: level
    };

    // 发送更新请求
    fetch('http://localhost:8080/user', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 1) {
                console.log('更新用户信息成功!');
            } else {
                console.log('更新用户信息失败');
            }
        })
        .catch(error => {
            console.error('更新用户信息请求出错:', error);
        });
}
