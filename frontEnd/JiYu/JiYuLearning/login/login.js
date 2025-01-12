import {loginUser, signupUser} from '../index/networkUtils.js';

let signup = document.querySelector('#signup');
let signin = document.querySelector('#signin');
let body = document.querySelector('body');

signup.onclick = function(){
    console.log("____跳转到注册页面_____");
    body.classList.add('signup');
}
signin.onclick = function(){
    console.log("____跳转到登录页面_____");
    body.classList.remove('signup');
}

document.querySelector('#signinForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止表单默认提交行为

    const username = document.querySelector('#signinUsername').value;
    const password = document.querySelector('#signinPassword').value;

    window.location.href = "../index/chat1.html";
    alert('登录成功！')
    loginUser(username, password).then((token) => {
        console.log("登录成功，跳转到index.html");
        alert('登录成功！')
        // 保存 用户名 用户ID 到localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('userId', token);
        // 跳转到chat1.html页面
        window.location.href = "../index/chat1.html";
    }).catch(error => {
        console.error("登录失败：", error);
        alert('登录失败！')
    });
});

// 绑定注册表单提交事件
document.querySelector('#signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止表单默认提交行为

    // 获取用户名、密码和确认密码
    const username = document.querySelector('#signupUsername').value;
    const password = document.querySelector('#signupPassword').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;

    window.location.href = "login.html"; // 跳转到登录页面

    // 调用signupUser进行注册
    signupUser(username, password, confirmPassword).then(() => {
        console.log("注册成功，跳转到登录页面");
        window.location.href = "login.html"; // 跳转到登录页面
    }).catch(error => {
        console.error("注册失败：", error);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // 等待移动动画结束后开始呼吸动画
    setTimeout(function() {
        document.querySelector('.intro-overlay p').style.transform = 'translateY(10px)';
        document.body.classList.add('breathing');
    }, 1000);

    document.querySelector('.intro-overlay').addEventListener('click', function() {
        document.body.classList.add('clear-bg'); // 清除模糊效果
        document.querySelector('.intro-overlay').style.display = 'none'; // 隐藏intro-overlay
        document.querySelector('.container').style.display = 'flex'; // 显示登录框
    });
});
