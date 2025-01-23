//根据账号名获取当前用户的ID
export function getIdByUsername() {
    const username = localStorage.getItem('username');

    // 发送注册请求
    fetch('http://localhost:8080/user?username='+username)
        .then(response => response.json())
        .then(user => {
            if (user.id != null) {
                console.log('成功查找到用户id');
                const id = user.id;
                alert("id为： "+id);
                localStorage.setItem("id",id);
            } else {
                console.log('找不到到用户id');
            }
        })
        .catch(error => {
            console.error('注册请求出错:', error);
        });
}

//根据账号名获取当前用户的昵称
export function getNameByUsername() {
    const username = localStorage.getItem('username');
    //请求的url：
    // 发送注册请求
    fetch('http://localhost:8080/user?username='+username)
        .then(response => response.json())
        .then(user => {
            if (user.name != null) {
                console.log('成功查找到用户name');
                const name = user.name;
                localStorage.setItem("name",name);
            } else {
                console.log('找不到到用户name');
            }
        })
        .catch(error => {
            console.error('注册请求出错:', error);
        });
}