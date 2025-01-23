// 配置全局变量的JS
console.log('chat1.js loaded');
// 获取设置按钮和侧边栏元素
export const settingsBtn = document.getElementById('settingsBtn');
export const sidebar = document.getElementById('sidebar');

// 获取工具栏中的普通模式按钮
export const chatButtonN = document.getElementById('normalButton');

// 获取工具栏中的批改模式按钮
export const chatButtonC = document.getElementById('btnCorrection');

// 最多允许打开的聊天框数量
export const maxChats = 2;

// 当前打开的聊天框数量
export let openChats = 0;

// 获取当前打开的聊天框数量
export function getOpenChats() {
    return openChats;
}

// 设置当前打开的聊天框数量
export function setOpenChats(value) {
        openChats = value;
}

// 控制变量，判断bot是否正在输出
export let isBotTyping = false;

// 获取bot是否正在输出
export function getIsBotTyping() {
    return isBotTyping;
}

// 设置bot是否正在输出
export function setIsBotTyping(value) {
    if (typeof value === 'boolean') {
        isBotTyping = value;
    } else {
        throw new Error('Invalid value for isBotTyping');
    }
}


// 刚开始的欢迎框
document.addEventListener('DOMContentLoaded', () => {
    // 获取localStorage中的用户名
    const username = localStorage.getItem('username');
    console.log("____用户名为" + username);
    
    // 检查用户名是否存在
    if (username) {
        // 在设置按钮左侧显示用户名
        const usernameDisplay = document.getElementById('usernameDisplay');
        usernameDisplay.textContent = `${username}`;

        // 显示欢迎模态框
        const welcomeMessage = document.getElementById('welcomeMessage');
        welcomeMessage.textContent = `${username}，欢迎您使用积语·云伴学智能系统`;

        const welcomeModal = document.getElementById('welcomeModal');
        welcomeModal.style.display = 'flex';

        // 绑定关闭按钮的点击事件
        const closeModal = document.getElementById('closeModal');
        closeModal.addEventListener('click', () => {
            welcomeModal.style.display = 'none';
        });
    } else {
        // 如果没有用户名，可能需要重定向回登录页面
        console.log("_____用户名没查找到");
    }
});

document.getElementById('btnDailyJi').addEventListener('click', function(){
        // 点击"每日刷题"跳转到每日刷题按钮
    if(localStorage.getItem('level') == 'middle'){//如果用户为'中等'水平
        window.location.href='../daily_homework/middle_question/middle_question.html';
    }
    else if(localStorage.getItem('level') == 'high'){//如果用户为'高手'水平
        window.location.href='../daily_homework//hard_question/hard_question.html';
    }
    else{
        window.location.href='../daily_homework//simple_question/simple_question.html';
    }
});