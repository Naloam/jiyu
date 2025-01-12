import { chatButtonC, getOpenChats, maxChats } from './chat1.js';
import { sendImageDataToBackend } from './networkUtils.js';
import { createChatWindow } from './chatWindow.js';

// 定义状态变量
let isQuestionConfirmed = false;
let isAnswerConfirmed = false;
let question, answer;

// 为批改模式按钮添加点击事件
chatButtonC.addEventListener('click', () => {
    console.log("点击批改模式按钮");
    // 检查当前打开的聊天框数量是否超过限制
    if (getOpenChats() >= maxChats) {
        alert('窗口已满，关闭一个试试');
    } else {
        // 创建新的聊天窗口并显示
        createCorrectionModal();
    }
});

function createCorrectionModal() {
    // 创建 overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlayC';
    
    console.log(overlay);
    
    // 创建悬浮框
    const modal = document.createElement('div');
    modal.className = 'modalC';
    
    // 添加内容
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.className = 'close-button';
    console.log(closeButton);
    closeButton.addEventListener('click', () => closeModal(modal, overlay));
    modal.appendChild(closeButton);

    const questionSection = createUploadSection('上传题目', 'question-input');
    modal.appendChild(questionSection.section);

    const answerSection = createUploadSection('上传答案', 'answer-input');
    modal.appendChild(answerSection.section);

    document.body.appendChild(overlay); // 添加覆盖层到页面
    document.body.appendChild(modal);
    modal.style.display = 'block';
    overlay.style.display = 'block'; // 显示覆盖层
}

function createUploadSection(labelText, inputId) {
    console.log(inputId);
    const section = document.createElement('div');
    section.className = 'upload-section';

    const label = document.createElement('label');
    label.textContent = labelText;
    section.appendChild(label);

    const textarea = document.createElement('textarea');
    textarea.id = inputId;
    section.appendChild(textarea);

    const textCount = document.createElement('div');
    textCount.className = 'text-count';
    textCount.textContent = `字数: 0`;
    section.appendChild(textCount);

    textarea.addEventListener('input', () => {
        textCount.textContent = `字数: ${textarea.value.length}`;
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const ocrButton = document.createElement('button');
    ocrButton.textContent = 'OCR';
    ocrButton.addEventListener('click', () => openOCRModal(createLoadingOverlay(), textarea));
    buttonContainer.appendChild(ocrButton);

    const clearButton = document.createElement('button');
    clearButton.textContent = '清空';
    clearButton.addEventListener('click', () => {
        textarea.value = '';
        textCount.textContent = '字数: 0';
    });
    buttonContainer.appendChild(clearButton);

    const confirmButton = document.createElement('button');
    confirmButton.textContent = '确认';
    console.log(textarea);

    confirmButton.addEventListener('click', () => {
        const isDisabled = textarea.disabled;
        textarea.disabled = !isDisabled;
        confirmButton.textContent = isDisabled ? '确认' : '解除锁定';
        // 更新状态
        if (inputId === 'question-input') {
            question = textarea.value;
            isQuestionConfirmed = !isQuestionConfirmed;
        } else if (inputId === 'answer-input') {
            answer = textarea.value;
            isAnswerConfirmed = !isAnswerConfirmed;
        }

        // 检查两个按钮的状态
        checkCloseCondition(question, answer);
    });
    buttonContainer.appendChild(confirmButton);

    section.appendChild(buttonContainer);

    return { section, textarea, confirmButton };
}

function checkCloseCondition(question, answer) {
    console.log("___题目框按钮："+isQuestionConfirmed+"__答案框按钮:"+isAnswerConfirmed)
    if (isQuestionConfirmed && isAnswerConfirmed) {
        
        // 调用外部函数，传入题目和答案
        processSubmission(question, answer);

        // 关闭所有悬浮框
        const modals = document.querySelectorAll('.modalC');
        const overlay = document.querySelectorAll('.overlayC');
        console.log(overlay);
        modals.forEach(modal => closeModal(modal, overlay[0]));
        isQuestionConfirmed = !isQuestionConfirmed;
        isAnswerConfirmed = !isAnswerConfirmed;
    }
}


export function showOverlay(overlay) {
    // 添加传入的蒙版到文档
    document.body.appendChild(overlay);
}

export function hideOverlay(overlay) {
    // 移除传入的蒙版
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
}

function closeModal(modal, overlay) {
    // 关闭悬浮框并移除蒙版
    if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
    }
    hideOverlay(overlay); // 移除蒙版
}
export function createLoadingOverlay() {
    // 创建全屏遮罩层
    const backgroundOverlay = document.createElement('div');
    backgroundOverlay.className = 'loading-overlay-background';

    // 创建加载框
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.textContent = '加载中...';

    // 将背景层和加载框组合到一个容器中
    const overlayContainer = document.createElement('div'); // 创建一个容器
    overlayContainer.appendChild(backgroundOverlay);
    overlayContainer.appendChild(loadingOverlay);

    return overlayContainer; // 确保返回的对象是有效的DOM节点
}



export function openOCRModal(overlay, textarea) {
    // console.log("__输入框id:" + inputId);

    // 创建OCR悬浮框
    const ocrModal = document.createElement('div');
    ocrModal.className = 'modalC';

    // 摄像头视频显示区域
    const video = document.createElement('video');
    video.style.width = '100%';
    video.style.height = 'auto';
    ocrModal.appendChild(video);

    // 获取摄像头视频流
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            video.play();
            ocrModal.stream = stream; // 将流保存到悬浮框对象上，以便后续处理
        })
        .catch(err => {
            console.error("无法访问摄像头: ", err);
        });

    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    // 确认图像按钮
    const confirmButton = document.createElement('button');
    confirmButton.textContent = '确认图像';
    confirmButton.addEventListener('click', () => {
        // 显示加载框并处理图像确认逻辑
        showOverlay(overlay);
        
        // 保存图像
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png'); // 图像数据保存为base64编码
        console.log('Image:', imageData);
        // 后发送图像数据到后端
        sendImageDataToBackend(imageData)
        .then(result => {
            // 假设 result 是 OCR 返回的文本
            console.log('OCR Result:', result);
    
        if (textarea) {
            textarea.value += result.result; // 将 OCR 结果填充到对应输入框
            textarea.dispatchEvent(new Event('input')); // 手动触发 input 事件更新字数统计
        }

            // 检查两个按钮的状态
            checkCloseCondition(question, answer);
        })
        .catch(error => {
            console.error('OCR Process Failed:', error);
        })
        .finally(() => {
            // 关闭悬浮框
            closeModal(ocrModal, overlay);

            // 停止摄像头
            const stream = ocrModal.stream;
            stream.getTracks().forEach(track => track.stop());
        });
    });
    buttonContainer.appendChild(confirmButton);

    // 取消图像按钮
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '取消图像';
    cancelButton.addEventListener('click', () => {
        closeModal(ocrModal, overlay);
        // 停止摄像头
        const stream = ocrModal.stream;
        stream.getTracks().forEach(track => track.stop());
    });
    buttonContainer.appendChild(cancelButton);

    ocrModal.appendChild(buttonContainer);

    document.body.appendChild(ocrModal);

    ocrModal.style.display = 'block';
}


function processSubmission(question, answer) {
    // 在这里处理题目和答案，例如发送到服务器或进行其他操作
    console.log('题目: ' + question);
    console.log('答案: ' + answer);

    const problem = "我的题目是:" + question + "我的答案是:" + answer;
    console.log("完整输入:" + problem);

    // 这里可以加入发送题目和答案到后端的逻辑
    createChatWindow(chatButtonC.id, chatButtonC.textContent, null, null, problem);
}