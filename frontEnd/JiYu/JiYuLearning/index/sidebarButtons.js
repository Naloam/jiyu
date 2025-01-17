// 获取 toolbar 元素
const toolbar = document.querySelector('.toolbar');

// 获取 toolbar 的高度
const toolbarHeight = toolbar.offsetHeight;

// 设置 CSS 变量
document.documentElement.style.setProperty('--toolbar-height', `${toolbarHeight}px`);

document.addEventListener('DOMContentLoaded', function () {
    // 获取按钮元素
    const guideButton = document.querySelector('.sidebar button:nth-child(2)');
    const accountInfoButton = document.querySelector('.sidebar button:nth-child(3)');
    const knowledgeBaseButton = document.querySelector('.sidebar button:nth-child(4)');
    const logoutButton = document.querySelector('.sidebar .logout');

    // 使用指南按钮点击事件
    guideButton.addEventListener('click', function () {
        const helpOverlay = document.createElement('div');
        helpOverlay.classList.add('overlay');
        helpOverlay.classList.add('fade-in');
        helpOverlay.style.position = 'fixed';
        helpOverlay.style.top = '0';
        helpOverlay.style.left = '0';
        helpOverlay.style.width = '100%';
        helpOverlay.style.height = '100%';
        helpOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        helpOverlay.style.display = 'flex';
        helpOverlay.style.justifyContent = 'center';
        helpOverlay.style.alignItems = 'center';
    
        const helpContent = document.createElement('div');
        helpContent.style.position = 'relative';
        helpContent.style.width = '90%'; // 增大宽度
        helpContent.style.maxWidth = '800px'; // 增加最大宽度
        helpContent.style.backgroundColor = 'white';
        helpContent.style.borderRadius = '10px';
        helpContent.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        helpContent.style.overflow = 'hidden';
        helpContent.style.display = 'flex';
        helpContent.style.flexDirection = 'column';
        helpContent.style.maxHeight = '80%';
    
        const helpTitle = document.createElement('div');
        helpTitle.style.padding = '20px';
        helpTitle.style.backgroundColor = '#444';
        helpTitle.style.color = 'white';
        helpTitle.style.borderBottom = '1px solid #ddd';
        helpTitle.innerHTML = '<h2 style="margin: 0;">使用帮助文档</h2>';
        helpContent.appendChild(helpTitle);
    
        const helpBody = document.createElement('div');
        helpBody.style.padding = '20px';
        helpBody.style.flex = '1';
        helpBody.style.overflowY = 'auto';
        helpContent.appendChild(helpBody);
    
        const markdownFile = '../src/Guidebook.md'; // 替换为你的Markdown文件路径
        fetch(markdownFile)
            .then(response => response.text())
            .then(data => {
                const markedInstance = new marked.Marked(); // 创建 Marked 实例
                helpBody.innerHTML += markedInstance.parse(data); // 使用 parse 方法转换
            })
            .catch(error => {
                console.error('Error loading the Markdown file:', error);
                helpBody.innerHTML += '<p>无法加载帮助文档内容。</p>';
            });
    
        const closeHelpBtn = document.createElement('button');
        closeHelpBtn.textContent = '关闭';
        closeHelpBtn.style.position = 'absolute';
        closeHelpBtn.style.top = '10px';
        closeHelpBtn.style.right = '10px';
        closeHelpBtn.style.padding = '10px';
        closeHelpBtn.style.backgroundColor = '#444';
        closeHelpBtn.style.color = 'white';
        closeHelpBtn.style.border = 'none';
        closeHelpBtn.style.borderRadius = '5px';
        closeHelpBtn.style.cursor = 'pointer';
        closeHelpBtn.addEventListener('click', function () {
            helpOverlay.classList.remove('fade-in');
            helpOverlay.classList.add('fade-out');
            setTimeout(() => {
                helpOverlay.remove();
            }, 300);
        });
    
        helpContent.appendChild(closeHelpBtn);
        helpOverlay.appendChild(helpContent);
        document.body.appendChild(helpOverlay);
    });

// 账号信息按钮点击事件
accountInfoButton.addEventListener('click', function () {
    // 创建模态框的容器
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex'; // 显示模态框

    // 创建模态框的内容
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // 创建关闭按钮
    const closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = function () {
        modal.style.display = 'none'; // 点击关闭按钮时隐藏模态框
    };

    // 创建标题
    const title = document.createElement('h2');
    title.textContent = '修改账号信息';

    // 创建输入框
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.placeholder = '新的用户名';
    usernameInput.style.display = 'block';
    usernameInput.style.margin = '10px auto';
    usernameInput.value = '新的用户名'; // 默认值

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = '新的密码';
    passwordInput.style.display = 'block';
    passwordInput.style.margin = '10px auto';
    passwordInput.value = '新的密码'; // 默认值

    const confirmPasswordInput = document.createElement('input');
    confirmPasswordInput.type = 'password';
    confirmPasswordInput.placeholder = '确认密码';
    confirmPasswordInput.style.display = 'block';
    confirmPasswordInput.style.margin = '10px auto';
    confirmPasswordInput.value = '确认密码'; // 默认值

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-around';
    buttonContainer.style.marginTop = '20px';

    // 创建确认修改按钮
    const confirmButton = document.createElement('button');
    confirmButton.textContent = '确认修改';
    confirmButton.onclick = function () {
        const newUsername = usernameInput.value;
        localStorage.setItem('username', newUsername); // 更新localStorage中的用户名
        alert('用户名已修改为：' + newUsername);
        modal.style.display = 'none'; // 隐藏模态框
        location.reload(); // 强制刷新浏览器
    };

    // 创建取消修改按钮
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '取消修改';
    cancelButton.onclick = function () {
        modal.style.display = 'none'; // 隐藏模态框
    };

    // 将按钮添加到按钮容器中
    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);

    // 将所有元素添加到模态框内容中
    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(usernameInput);
    modalContent.appendChild(passwordInput);
    modalContent.appendChild(confirmPasswordInput);
    modalContent.appendChild(buttonContainer);

    // 将模态框内容添加到模态框容器中
    modal.appendChild(modalContent);

    // 将模态框添加到body中
    document.body.appendChild(modal);
});



    // 知识库按钮点击事件
    knowledgeBaseButton.addEventListener('click', () => {
        create_kbs("../kbs/_kbs_.html", "../kbs/_kbs_.css", "../kbs/_kbs_.js");
});


    // 退出登录按钮点击事件
    logoutButton.addEventListener('click', function () {
        // 预留保存现场接口
        saveCurrentState();

        // 返回到登录注册页面
        window.location.href = '../login02/login.html'; // 假设登录注册页面为login.html
    });

    // 预留保存当前现场的函数
    function saveCurrentState() {
        // 在这里添加保存现场的逻辑
        console.log('保存当前现场...');
        // 例如，保存到本地存储或发送到服务器
    }
});

export function create_kbs(html, css, js){
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
        title.textContent = '高等数学知识点';
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

        // 在JS文件加载完成后执行initializeKnowledgePoints
        knowledgeJS.onload = function () {
            console.log('知识库JS文件加载完成，初始化知识点... ');

            // 初始化知识点并在完成后隐藏加载框
            initializeKnowledgePoints().then(() => {
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

