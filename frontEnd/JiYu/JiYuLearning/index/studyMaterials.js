import { createChatWindow } from './chatWindow.js';
import { openChats } from './chat1.js';

document.addEventListener('DOMContentLoaded', () => {
    const materialsModal = document.getElementById('materialsModel');
    const btnMaterials = document.getElementById('btnMaterials');
    const closeMaterialsModel = document.getElementById('closeMaterialsModel');
    
    console.log("___学习资料按钮", btnMaterials); // 打印按钮元素
    console.log("___悬浮窗元素", materialsModal); // 打印悬浮窗元素

    if (btnMaterials) {
        btnMaterials.addEventListener('click', () => {
            materialsModal.style.display = 'flex';  // 显示悬浮窗
        });
    } else {
        console.error('未找到id为btnMateriels的元素');
    }

    if (closeMaterialsModel) {
        closeMaterialsModel.addEventListener('click', () => {
            materialsModal.style.display = 'none';  // 关闭悬浮窗
        });
    }

    // 为每个学习资料按钮绑定点击事件
    const materialButtons = document.querySelectorAll('.material-btn');
    console.log("___学习资料按钮们", materialButtons); // 打印学习资料按钮


    // 在此处限制窗口数量最多为2
    materialButtons.forEach(button => {
        button.addEventListener('click', () => {
            const resourceTitle = button.textContent.trim(); // 获取用户点击的资源按钮标题
            const url = button.getAttribute('data-url');
            const fullTitle = `学习资料 - ${resourceTitle}`;
            if (url && openChats <= 1) {
                console.log("____窗口数："+openChats);
                createChatWindow('materialButton', fullTitle, url);
                materialsModal.style.display = 'none';  // 关闭悬浮窗
            } else {
                alert('窗口已满，关闭一个试试');
            }
        });
    });
});

