import { chatButtonN, maxChats, getOpenChats, 
    setOpenChats, getIsBotTyping, sidebar } from './chat1.js';
import { sendMessage } from './sendMessage.js';
import { generateCustomUUID } from './networkUtils.js';
import { sendImageDataToBackend } from './networkUtils.js';
console.log('chatWindow.js loaded');


// 为普通模式按钮添加点击事件
chatButtonN.addEventListener('click', () => {
    console.log("点击普通模式按钮");
    // 检查当前打开的聊天框数量是否超过限制
    if (getOpenChats() >= maxChats) {
        alert('窗口已满，关闭一个试试');
    } else {
        // 创建新的聊天窗口
        createChatWindow(chatButtonN.id, chatButtonN.textContent);
    }
});

// 为第二个按钮的下拉菜单选项绑定点击事件
const dropdownOptions = document.querySelectorAll('.dropdown-buttons .learn-btn');

dropdownOptions.forEach((option, index) => {
    option.addEventListener('click', () => {
        if (index === 1) {  // 第二个按钮（索引从0开始）
            learnMoreModal.style.display = 'flex'; // 显示悬浮框
        } else {
            if (getOpenChats() >= maxChats) {
                alert('窗口已满，关闭一个试试');
            } else {
                const title = option.childNodes[0].nodeValue.trim();

                // 调用知识点供用户选取
                create_kbs_learn("../kbs_learn/_kbs_learn.html", "../kbs_learn/_kbs_learn.css", "../kbs_learn/_kbs_learn.js", function(knowledge) {
                    console.log('接收到的知识点文本:', knowledge);
                    
                    // 只有在 knowledge 已经获得之后才调用 createChatWindow
                    createChatWindow("learnButton", title + ' ' + knowledge, null, knowledge);
                });
            }
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // 获取localStorage中的用户名
    const username = localStorage.getItem('username');
    console.log("____用户名为" + username);
    // 检查用户名是否存在
    if (username) {
        // 在设置按钮左侧显示用户名
        const usernameDisplay = document.getElementById('usernameDisplay');
        usernameDisplay.textContent = `${username}`;
    } else {
        // 如果没有用户名，可能需要重定向回登录页面
        console.log("_____用户名没查找到");
    }
});

// 创建聊天窗口的函数
export function createChatWindow(buttonId, title, url = null, knowledge = null, problem = null) {
    console.log(`Creating chat window with ID: ${buttonId} and Title: ${title}`);
    setOpenChats(getOpenChats() + 1); // 增加当前打开的聊天框数量
    console.log("当前窗口数量：" + getOpenChats());
    
    // 对话框ID
    const conId = generateCustomUUID();

    // 确定property值
    let property;
    if (buttonId === 'normalButton') {
        property = 'normal';
    } else if (buttonId === 'learnButton') {
        property = 'learn';
        console.log("学习的知识点是是：" + knowledge);
    } else if (buttonId === 'btnCorrection') {
        property = 'correction';
        console.log("批改问题是：" + problem);
    } else if (buttonId === 'materialButton') {
        property = 'material';
    } else {
        property = 'default'; // 默认值，如果没有匹配到已知的按钮ID
    }

    // 创建一个新的聊天容器
    const chatContainer = document.createElement('div');
    chatContainer.classList.add('chat-container');
    chatContainer.style.width = '40%';
    chatContainer.history = []; // 初始化聊天记录

    // 聊天框数量调整新窗口的位置
    const chatContainers = document.querySelectorAll('.chat-container');
    if (getOpenChats() === 1) {
        chatContainer.style.left = '30%';
    } else if (getOpenChats() === 2) {
        const firstChat = chatContainers[0];
        firstChat.style.left = sidebar.classList.contains('open') ? '3%' : '10%';
        chatContainer.style.left = sidebar.classList.contains('open') ? '43%' : '53%';
    }

    // 创建聊天工具栏
    const chatToolbar = document.createElement('div');
    chatToolbar.classList.add('chat-toolbar');

    // 历史记录按钮
    const historyButton = document.createElement('button');
    historyButton.textContent = 'History';
    historyButton.style.marginRight = '10px';
    historyButton.addEventListener('click', () => {
        showHistory(chatContainer);
    });

    // 聊天标题
    const chatTitle = document.createElement('span');
    chatTitle.classList.add('chat-title');
    chatTitle.textContent = title;
    chatTitle.addEventListener('click', () => {
        toggleFullScreenChat(chatContainer);
    });

    // 关闭按钮 判断是否为学习模式
    const closeChatBtn = document.createElement('button');
    closeChatBtn.textContent = 'Close';

    if(property === 'learn'){
        closeChatBtn.addEventListener('click', () => {
            // 生成悬浮框
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.style.display = 'flex'; // 显示悬浮框
        
            const modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');
            modalContent.textContent = '现在去点亮' + knowledge + '知识点吧！';
        
            const closeModalBtn = document.createElement('span');
            closeModalBtn.classList.add('close');
            closeModalBtn.textContent = '×';
            closeModalBtn.addEventListener('click', () => {
                modal.style.display = 'none'; // 关闭悬浮框
            });
        
            modalContent.appendChild(closeModalBtn);
            modal.appendChild(modalContent);
            document.body.appendChild(modal); // 将悬浮框添加到页面
        
            // 继续原来的关闭聊天框逻辑
            chatContainer.classList.add('closing');
            setTimeout(() => {
                chatContainer.remove(); // 移除聊天框
                setOpenChats(getOpenChats() - 1); // 减少当前打开的聊天框数量
                rearrangeChats(); // 重新调整其他聊天框的位置
            }, 300);
        });
    }
    else{
        closeChatBtn.addEventListener('click', () => {
            chatContainer.classList.add('closing');
            setTimeout(() => {
                chatContainer.remove(); // 移除聊天框
                setOpenChats(getOpenChats() - 1); // 减少当前打开的聊天框数量
                rearrangeChats(); // 重新调整其他聊天框的位置
            }, 300);
        });
    }

    chatToolbar.appendChild(historyButton);
    chatToolbar.appendChild(chatTitle);
    chatToolbar.appendChild(closeChatBtn);

    // 创建聊天窗口主体
    const chatWindow = document.createElement('div');
    chatWindow.classList.add('chat-window');

    // 材料类型则显示iframe，否则显示输入区
    if (property === 'material' && url) {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        chatWindow.appendChild(iframe);
        chatContainer.appendChild(chatToolbar);
        chatContainer.appendChild(chatWindow);
    } else {
        // 输入容器
        const inputContainer = document.createElement('div');
        inputContainer.classList.add('input-container');

        // 文本输入框
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = '请输入';
        inputField.id = `${buttonId}-input`;

        // 摄像头按钮
        const cameraButton = document.createElement('button');
        cameraButton.textContent = '📷';
        cameraButton.addEventListener('click', () => {
            const chatRect = chatContainer.getBoundingClientRect(); // 获取 chat-container 的位置信息
            // 创建悬浮框
            const overlay = document.createElement('div');
            overlay.classList.add('overlay');
            overlay.style.position = 'fixed';
            // 动态计算悬浮框的位置，使其位于 chatContainer 的中间
            overlay.style.left = `${chatRect.left + chatRect.width / 2}px`;
            overlay.style.top = `${chatRect.top + chatRect.height / 2}px`;
            overlay.style.transform = 'translate(-50%, -50%)';
            overlay.style.zIndex = '1000000';
            overlay.style.backgroundColor = 'whitle';
            overlay.style.padding = '20px';
            overlay.style.borderRadius = '10px';
            overlay.style.flexDirection = 'column';
            overlay.style.alignItems = 'center';
            overlay.style.width = `${chatRect.width * 0.85}px`;
            overlay.style.height = `${chatRect.height * 0.60}px`;

            console.log(overlay); // 检查 overlay 是否正确创建并添加到 DOM
            // 创建视频元素，用于显示摄像头捕捉的图像
            const video = document.createElement('video');
            video.style.width = '100%';
            video.style.height = 'auto';
            video.autoplay = true;
        
            // 获取摄像头图像
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    video.srcObject = stream;
        
                    // 创建按钮容器
                    const buttonContainer = document.createElement('div');
                    buttonContainer.style.display = 'flex';
                    buttonContainer.style.justifyContent = 'space-between';
                    buttonContainer.style.width = '100%';
                    buttonContainer.style.marginTop = '20px';
        
                    // 创建确认按钮
                    const confirmButton = document.createElement('button');
                    confirmButton.textContent = '确认';
                    confirmButton.style.padding = '10px';
                    confirmButton.style.backgroundColor = '#28a745';
                    confirmButton.style.color = 'white';
                    confirmButton.style.border = 'none';
                    confirmButton.style.borderRadius = '5px';
                    confirmButton.style.cursor = 'pointer';
                    confirmButton.style.marginRight = '10px';
        
                    confirmButton.addEventListener('click', () => {
                        // 创建 canvas，用于捕获视频帧图像
                        const canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        const context = canvas.getContext('2d');
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const imageData = canvas.toDataURL('image/png'); // 将图像数据保存为 base64 编码的字符串
                    
                        // 停止摄像头流
                        stream.getTracks().forEach(track => track.stop());
                    
                        // 获取当前的 chatContainer
                        const chatContainer = cameraButton.closest('.chat-container');
                    
                        // 创建蒙版覆盖 chatContainer
                        const mask = document.createElement('div');
                        mask.style.position = 'absolute';
                        mask.style.top = '0';
                        mask.style.left = '0';
                        mask.style.width = '100%';
                        mask.style.height = '100%';
                        mask.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                        mask.style.display = 'flex';
                        mask.style.justifyContent = 'center';
                        mask.style.alignItems = 'center';
                        mask.style.zIndex = '10000001';
                    
                        // 加载框
                        const loadingBox = document.createElement('div');
                        loadingBox.textContent = '加载中...';
                        loadingBox.style.backgroundColor = 'white';
                        loadingBox.style.padding = '20px';
                        loadingBox.style.borderRadius = '10px';
                        loadingBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
                    
                        // 将加载框添加到蒙版中
                        mask.appendChild(loadingBox);
                    
                        console.log('Chat container:', chatContainer);
                        console.log('Mask:', mask);
                        
                        // 将蒙版添加到 chatContainer 中
                        chatContainer.appendChild(mask);
                    
                        // 移除 OCR 悬浮框
                        overlay.remove(); 
                    
                        //  OCR 发送到后端
                        sendImageDataToBackend(imageData)
                        .then(result => {
                        console.log('OCR Result:', result);
                        // 在此处处理 OCR 返回的文本，并更新相应的输入框或 UI 元素
                        inputField.value += result.result;
                        mask.remove(); // 移除蒙版
                        })
                        .catch(error => {
                        console.error('OCR 处理失败:', error);
                        // 如果发生错误，可以在此处显示错误信息，并移除蒙版
                        mask.remove(); // 移除蒙版
                        });
                    });
        
                    // 创建取消按钮
                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = '取消';
                    cancelButton.style.padding = '10px';
                    cancelButton.style.backgroundColor = '#dc3545';
                    cancelButton.style.color = 'white';
                    cancelButton.style.border = 'none';
                    cancelButton.style.borderRadius = '5px';
                    cancelButton.style.cursor = 'pointer';
        
                    cancelButton.addEventListener('click', () => {
                        // 关闭摄像头
                        stream.getTracks().forEach(track => track.stop());
        
                        // 移除悬浮框
                        overlay.remove();
                    });
        
                    buttonContainer.appendChild(confirmButton);
                    buttonContainer.appendChild(cancelButton);
                    overlay.appendChild(video);
                    overlay.appendChild(buttonContainer);
                    document.body.appendChild(overlay);
                    overlay.style.display = 'block';  // 强制显示
                    overlay.style.opacity = '1';      // 确保透明度为1
                })
                .catch(error => {
                    alert('Failed to access camera: ' + error.message);
                });
        });
        

        // 发送按钮
        const sendButton = document.createElement('button');
        sendButton.textContent = 'Send';
        sendButton.disabled = getIsBotTyping();
        function handleSendMessage() {
            if (property === 'normal') {
                sendMessage(inputField, chatWindow, sendButton, chatContainer, property, conId);
            } else if (property === 'learn') {
                sendMessage(inputField, chatWindow, sendButton, chatContainer, property, conId, knowledge);
            } else if (property === 'correction') {
                sendMessage(inputField, chatWindow, sendButton, chatContainer, property, conId, null, problem);
            }
        }
        
        // 增加绑定事件
        sendButton.addEventListener('click', handleSendMessage);
        
        // Add keydown event listener for Enter key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !sendButton.disabled) {
                handleSendMessage();
            }
        });
        

        inputContainer.appendChild(inputField);
        inputContainer.appendChild(cameraButton);
        inputContainer.appendChild(sendButton);

        chatContainer.appendChild(chatToolbar);
        chatContainer.appendChild(chatWindow);
        chatContainer.appendChild(inputContainer);

        if (property === 'correction' && problem) {
            inputField.value = problem; // 设置输入框内容为问题
            console.log("___" + problem);
            sendButton.click(); // 模拟点击发送按钮
            inputField.value = ''; // 清空输入框
        }
        else if(property === 'learn' && knowledge)
        {
            const inputLearn = "我选择用费曼学习法学习" + knowledge + "知识点，请给出学习建议";
            inputField.value = inputLearn; // 设置输入框内容为问题
            console.log("___" + inputLearn);
            sendButton.click(); // 模拟点击发送按钮
            inputField.value = ''; // 清空输入框
        }
    }

    // 将聊天容器添加到文档主体中
    document.body.appendChild(chatContainer);

    // 调整所有聊天框的位置
    rearrangeChats();
}


// 重新调整所有聊天框的位置
function rearrangeChats() {
    const chatContainers = document.querySelectorAll('.chat-container');
    chatContainers.forEach(container => container.style.display = '');
    if (chatContainers.length === 1) {
        chatContainers[0].style.left = '30%';
    } else if (chatContainers.length === 2) {
        chatContainers[0].style.left = sidebar.classList.contains('open') ? '3%' : '10%';
        chatContainers[1].style.left = sidebar.classList.contains('open') ? '43%' : '53%';
    }
} 

// 切换聊天窗口全屏模式
function toggleFullScreenChat(chatContainer) {
    const isFullScreen = chatContainer.classList.contains('fullscreen');

    if (isFullScreen) {
        // 如果是全屏状态，恢复原始大小和位置
        chatContainer.classList.remove('fullscreen');
        chatContainer.style.position = '';
        chatContainer.style.left = chatContainer.dataset.originalLeft;
        chatContainer.style.top = chatContainer.dataset.originalTop;
        chatContainer.style.width = chatContainer.dataset.originalWidth;
        chatContainer.style.height = chatContainer.dataset.originalHeight;

        // 显示其他聊天框
        document.querySelectorAll('.chat-container').forEach(container => {
            if (container !== chatContainer) {
                container.style.display = '';
            }
        });

        rearrangeChats(); // 调整所有聊天框的位置
    } else {
        // 保存当前聊天框的原始位置和大小
        chatContainer.dataset.originalLeft = chatContainer.style.left;
        chatContainer.dataset.originalTop = chatContainer.style.top;
        chatContainer.dataset.originalWidth = chatContainer.style.width;
        chatContainer.dataset.originalHeight = chatContainer.style.height;

        // 隐藏其他聊天框
        document.querySelectorAll('.chat-container').forEach(container => {
            if (container !== chatContainer) {
                container.style.display = 'none';
            }
        });

        // 设置当前聊天框为全屏
        chatContainer.classList.add('fullscreen');
        chatContainer.style.position = 'fixed';
        chatContainer.style.left = '0';
        chatContainer.style.top = '0';
        chatContainer.style.width = '100%';
        chatContainer.style.height = '100%';
    }
}


export function create_kbs_learn(html, css, js, knowledgeCallback){
    // 动态加载外部HTML文件
    fetch(html)
    .then(response => response.text())
    .then(data => {
        // 创建悬浮知识库窗口
        const knowledgeOverlay = document.createElement('div');
        knowledgeOverlay.classList.add('overlay');
        knowledgeOverlay.classList.add('fade-in'); // 添加打开动画类

        // 创建加载框元素
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.alignItems = 'center';
        loadingOverlay.style.justifyContent = 'center';
        loadingOverlay.style.position = 'fixed';
        loadingOverlay.style.top = '0';
        loadingOverlay.style.left = '0';
        loadingOverlay.style.width = '100%';
        loadingOverlay.style.height = '100%';
        loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        loadingOverlay.style.zIndex = '9999';
        loadingOverlay.innerHTML = '<div class="spinner"></div>'; // 这里可以放置你的加载动画

        // 将加载框添加到悬浮框中
        knowledgeOverlay.appendChild(loadingOverlay);

        // 创建标题元素
        const title = document.createElement('h2');
        title.textContent = '选择学习的年级';
        title.style.marginBottom = '30px'; // 设置标题与内容之间的间距
        title.style.textAlign = 'center'; // 居中标题

        // 创建内容容器
        const knowledgeContent = document.createElement('div');
        knowledgeContent.classList.add('content-box');
        knowledgeContent.innerHTML = data;
        knowledgeContent.style.marginTop = '50px'; // 如果你想在内容上方增加额外的间距

        // 创建一个包含标题和内容的容器
        const container = document.createElement('div');
        container.appendChild(title); // 添加标题到容器
        container.appendChild(knowledgeContent); // 添加内容到容器

        // 将容器添加到悬浮框
        knowledgeOverlay.appendChild(container);

        // 添加关闭按钮
        const closeKnowledgeBtn = document.createElement('button');
        closeKnowledgeBtn.textContent = '关闭';
        closeKnowledgeBtn.style.position = 'absolute';
        closeKnowledgeBtn.style.top = '10px';
        closeKnowledgeBtn.style.right = '10px';
        closeKnowledgeBtn.style.padding = '10px';
        closeKnowledgeBtn.style.backgroundColor = '#444';
        closeKnowledgeBtn.style.color = 'white';
        closeKnowledgeBtn.style.border = 'none';
        closeKnowledgeBtn.style.borderRadius = '5px';
        closeKnowledgeBtn.style.cursor = 'pointer';
        closeKnowledgeBtn.addEventListener('click', function () {
            knowledgeOverlay.classList.remove('fade-in');
            knowledgeOverlay.classList.add('fade-out'); // 添加关闭动画类
            setTimeout(() => {
                knowledgeOverlay.remove();
            }, 300); // 动画持续时间
        });

        knowledgeOverlay.appendChild(closeKnowledgeBtn);
        document.body.appendChild(knowledgeOverlay);

        // 动态加载CSS文件
        const knowledgeCSS = document.createElement('link');
        knowledgeCSS.rel = 'stylesheet';
        knowledgeCSS.href = css; // 确保路径正确
        document.head.appendChild(knowledgeCSS);

        // 动态加载JS文件
        const knowledgeJS = document.createElement('script');
        knowledgeJS.src = js; // 确保路径正确
        knowledgeJS.defer = true; // 确保在HTML加载后执行

        // 在JS文件加载完成后执行initializeKnowledgePoints_learn
        knowledgeJS.onload = function () {
            console.log('知识库JS文件加载完成，初始化知识点...');
            initializeKnowledgePoints_learn(knowledgeCallback, knowledgeOverlay).then(() => {
                // 数据加载完成后隐藏加载框
                loadingOverlay.style.display = 'none';
            }).catch(error => {
                console.error('初始化知识点时出错:', error);
                loadingOverlay.style.display = 'none'; // 即使出错也要隐藏加载框
            });
        };

        document.body.appendChild(knowledgeJS);

    })
    .catch(error => console.error('Error loading HTML, CSS, or JS:', error));
}

// 悬浮框关闭事件
closeLearnMoreModal.addEventListener('click', () => {
    learnMoreModal.style.display = 'none';
});

// 点击模态框外部区域关闭模态框
window.addEventListener('click', (event) => {
    if (event.target === learnMoreModal) {
        learnMoreModal.style.display = 'none';
    }
});