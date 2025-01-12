// 获取设置按钮和侧边栏元素
import { settingsBtn } from './chat1.js';
import { sidebar } from './chat1.js';

// 为设置按钮添加点击事件，切换侧边栏的显示状态
settingsBtn.addEventListener('click', function() {
    const chatContainers = document.querySelectorAll('.chat-container');

    if (sidebar.classList.contains('open')) {
        // 如果侧边栏已经打开，则关闭侧边栏
        console.log("___关闭侧边栏");
        sidebar.classList.remove('open');
        settingsBtn.src = '../img/settings.png';  // 切换为默认图标
        settingsBtn.style.filter = 'grayscale(100%)';
        setTimeout(() => {
            sidebar.style.display = 'none';
            // 根据聊天框数量调整它们的位置
            if (chatContainers.length === 2) {
                chatContainers[0].style.left = '10%';
                chatContainers[1].style.left = '53%';
            }
        }, 300);
    } else {
        // 如果侧边栏未打开，则打开侧边栏
        console.log("____打开侧边栏");
        sidebar.style.display = 'block';
        settingsBtn.src = '../img/settings-active.png';  // 切换为激活图标
        setTimeout(() => {
            sidebar.classList.add('open');
            settingsBtn.style.filter = 'none';
            // 根据聊天框数量调整它们的位置
            if (chatContainers.length === 2) {
                chatContainers[0].style.left = '3%';
                chatContainers[1].style.left = '43%';
            }
        }, 10);
    }
});