import { setIsBotTyping } from './chat1.js';
import { sendUserInputC, sendUserInputL, sendUserInputN } from './networkUtils.js'; // 假设你的API函数在api.js中

// 三个模式 三个step 两个stage
let stepN = 0, stepL = 0, stepC = 0;
let stageL = 1, stageC = 1;

export function sendMessage(inputField, chatWindow, sendButton, chatContainer, property, conId, knowledge = null, problem = null) {
    const message = inputField.value.trim();
    if (message === '') return; // 如果消息为空，不执行任何操作

    // 在聊天窗口中添加用户消息
    addMessageToChat(message, 'user-message', chatWindow);

    // 添加等待动画
    const botTypingContainer = document.createElement('div');
    botTypingContainer.classList.add('dot-container');
    const dot1 = document.createElement('div');
    dot1.classList.add('dot');
    const dot2 = document.createElement('div');
    dot2.classList.add('dot');
    const dot3 = document.createElement('div');
    dot3.classList.add('dot');
    botTypingContainer.appendChild(dot1);
    botTypingContainer.appendChild(dot2);
    botTypingContainer.appendChild(dot3);
    
    chatWindow.appendChild(botTypingContainer); // 将等待动画添加到聊天窗口

    console.log("___对话id:" + conId);
    if (property === 'normal') {

        console.log("___stepN:" + stepN)
        // 普通模式 向后端传递用户信息
        sendUserInputN(conId, message, stepN)
        .then(response => {
            const { botMessage, step: newStep } = response;
            console.log("User信息发送成功");
    
            setIsBotTyping(true); // 机器人开始输入
            sendButton.disabled = true; // 发送按钮禁用
    
            // 将从后端获取的机器人回复添加到聊天窗口中
            addMessageToChat(botMessage, 'bot-message', chatWindow);
    
            // 移除等待动画
            botTypingContainer.remove();
    
            // 更新 step 值
            stepN = newStep;
            console.log("__当前步数: " + stepN);
        })
        .catch(error => {
            console.error("获取Bot信息失败：", error);
            const errorMessage = "机器人暂时无法回答，请稍后再试。";
            
            // 移除等待动画
            botTypingContainer.remove();
            
            addMessageToChat(errorMessage, 'bot-message', chatWindow);
        }).finally(() => {
            // 确保发送按钮重新启用
            sendButton.disabled = false;
            setIsBotTyping(false); // 停止机器人输入状态
        });
    } else if(property === 'learn')
    {  
    // 学习模式 向后端传递用户信息
        
        sendUserInputL(conId, knowledge, message, stageL, stepL)
        .then(({ botMessage, stage: newStage, step: newStep }) => {
            console.log("User信息发送成功");
    
            setIsBotTyping(true); // 机器人开始输入
            sendButton.disabled = true; // 发送按钮禁用
    
            // 将从后端获取的机器人回复添加到聊天窗口中
            addMessageToChat(botMessage, 'bot-message', chatWindow);

    
            // 更新 stage 和 step 值
            stageL = newStage;
            stepL = newStep;
            console.log("__当前状态: " + stageL);
            console.log("__当前步数: " + stepL);
        })
        .catch(error => {
            console.error("自定义学习失败：", error);
            const errorMessage = "大模型暂时无法回答，请稍后再试。";
            addMessageToChat(errorMessage, 'bot-message', chatWindow);
        })
        .finally(() => {
            // 移除等待动画
            botTypingContainer.remove();
    
            // 确保发送按钮重新启用
            sendButton.disabled = false;
            setIsBotTyping(false); // 停止机器人输入状态
        });
    } else if (property === 'correction') {
        if (stepC === 0) {
            
            // 拆分字符串
            const questionStartIndex = problem.indexOf("我的题目是:") + "我的题目是:".length;
            const answerStartIndex = problem.indexOf("我的答案是:");
            
            const question = problem.substring(questionStartIndex, answerStartIndex).trim();
            const answer = problem.substring(answerStartIndex + "我的答案是:".length).trim();
            
            // 首次批改模式 
            // 答疑首次输入 题目 答案 用户输入为空
            sendUserInputC(conId, question, answer, null, stageC, stepC)
            .then(({ botMessage, stage: newStage, step: newStep }) => {
                console.log("User信息发送成功");
                
                setIsBotTyping(true); // 机器人开始输入
                sendButton.disabled = true; // 发送按钮禁用
                
                // 将从后端获取的机器人回复添加到聊天窗口中
                addMessageToChat(botMessage, 'bot-message', chatWindow);

                // 更新 stage 和 step 值
                stageC = newStage;
                stepC = newStep;
                console.log("__当前状态: " + stageC);
                console.log("__当前步数: " + stepC);
            })
            .catch(error => {
                console.error("批改模式首次传递失败：", error);
                const errorMessage = "大模型暂时无法回答，请稍后再试。";
                addMessageToChat(errorMessage, 'bot-message',  chatWindow);
            })
            .finally(() => {
                // 移除等待动画
                botTypingContainer.remove();
                
                // 确保发送按钮重新启用
                sendButton.disabled = false;
                setIsBotTyping(false); // 停止机器人输入状态
            });
        } else {
            // 后续批改模式 向后端传递用户输入
            // 题目 答案 为空
            sendUserInputC(conId, null, null, message, stageC, stepC)
            .then(({ botMessage, stage: newStage, step: newStep }) => {
                console.log("User信息发送成功");
                console.log(botMessage);
                setIsBotTyping(true); // 机器人开始输入
                sendButton.disabled = true; // 发送按钮禁用
                
                // 将从后端获取的机器人回复添加到聊天窗口中
                addMessageToChat(botMessage, 'bot-message', chatWindow);
                
                // 更新 stage 和 step 值
                stageC = newStage;
                stepC = newStep;
                console.log("__当前状态: " + stageC);
                console.log("__当前步数: " + stepC);
            })
            .catch(error => {
                console.error("批改模式2后续传递失败：", error);
                const errorMessage = "大模型暂时无法回答，请稍后再试。";
                addMessageToChat(errorMessage, 'bot-message',chatWindow);
            })
            .finally(() => {
                // 移除等待动画
                botTypingContainer.remove();
                
                // 确保发送按钮重新启用
                sendButton.disabled = false;
                setIsBotTyping(false); // 停止机器人输入状态
            });
        }
    }

    setIsBotTyping(false); // 机器人停止输入
    sendButton.disabled = false; // 启用发送按钮
    inputField.value = ''; // 清空输入框
}

function addMessageToChat(message, className, chatWindow) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', className);
    const messageElement = document.createElement('p');

    // 设置 marked.js 的选项
    marked.setOptions({
        gfm: true,
        breaks: false,
        pedantic: false,
        smartLists: true,
        smartypants: false,
    });

    if (className === 'bot-message') {
        // 解析 Markdown 并立即将内容注入页面
        const htmlContent = marked.parse(message);
        messageElement.innerHTML = htmlContent;

        // 检查 MathJax 是否加载成功并使用 typesetPromise
        if (typeof MathJax !== 'undefined' && typeof MathJax.typesetPromise === 'function') {
            MathJax.typesetPromise([messageElement]).then(() => {
                console.log("公式已渲染");
            }).catch((err) => {
                console.error("MathJax 渲染出错:", err);
            });
        } else {
            console.error("MathJax is not loaded or not configured correctly.");
        }
    } else {
        // 对于非 bot 消息，直接使用 textContent
        messageElement.textContent = message;
    }

    messageContainer.appendChild(messageElement);
    chatWindow.appendChild(messageContainer);

    chatWindow.scrollTop = chatWindow.scrollHeight; // 滚动到聊天窗口底部
}

