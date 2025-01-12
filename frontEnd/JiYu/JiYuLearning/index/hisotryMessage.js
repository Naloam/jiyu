// 显示聊天记录的函数
export function showHistory(chatContainer) {
    const historyOverlay = document.createElement('div');
    historyOverlay.style.position = 'absolute';
    historyOverlay.style.top = '0';
    historyOverlay.style.left = '0';
    historyOverlay.style.width = '100%';
    historyOverlay.style.height = '100%';
    historyOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    historyOverlay.style.zIndex = '100';
    historyOverlay.style.padding = '20px';
    historyOverlay.style.overflowY = 'auto';
    historyOverlay.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

    // 创建历史记录标题
    const historyTitle = document.createElement('h2');
    historyTitle.textContent = 'Chat History';
    historyTitle.style.marginBottom = '20px';

    // 创建关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', () => {
        historyOverlay.remove(); // 关闭历史记录视图
    });

    // 创建历史记录内容
    const historyContent = document.createElement('div');
    chatContainer.history.forEach(entry => {
        const entryElement = document.createElement('p');
        entryElement.textContent = entry;
        historyContent.appendChild(entryElement);
    });

    // 将元素添加到历史记录视图中
    historyOverlay.appendChild(historyTitle);
    historyOverlay.appendChild(closeBtn);
    historyOverlay.appendChild(historyContent);

    // 将历史记录视图添加到聊天容器中
    chatContainer.appendChild(historyOverlay);
}
