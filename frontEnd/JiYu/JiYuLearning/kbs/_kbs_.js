const progressData = {
    'overlay-grade-1': { learned: 0, total: 6, ids: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] },
    'overlay-grade-2': { learned: 0, total: 13, ids: ['item7', 'item8', 'item9', 'item10', 'item11', 'item12', 'item13', 'item14', 'item15', 'item16', 'item17', 'item18', 'item19'] },
    'overlay-grade-3': { learned: 0, total: 17, ids: ['item20', 'item21', 'item22', 'item23', 'item24', 'item25', 'item26', 'item27', 'item28', 'item29', 'item30', 'item31', 'item32', 'item33', 'item34', 'item35', 'item36'] },
    'overlay-grade-4': { learned: 0, total: 16, ids: ['item37', 'item38', 'item39', 'item40', 'item41', 'item42', 'item43', 'item44', 'item45', 'item46', 'item47', 'item48', 'item49', 'item50', 'item51', 'item52'] },
    'overlay-grade-5': { learned: 0, total: 13, ids: ['item53', 'item54', 'item55', 'item56', 'item57', 'item58', 'item59', 'item60', 'item61', 'item62', 'item63', 'item64', 'item65'] },
    'overlay-grade-6': { learned: 0, total: 12, ids: ['item66', 'item67', 'item68', 'item69', 'item70', 'item71', 'item72', 'item73', 'item74', 'item75', 'item76', 'item77'] }
};

// 显示悬浮页面的同时更新进度条
function showOverlay(id) {
    const overlay = document.querySelector(`#kbs #${id}`);
    if (overlay) {
        overlay.style.display = 'flex';
        
        // 不再提取年级部分，直接使用完整的ID传递
        console.log(`显示悬浮页面：${id}`);
        
        // 直接使用完整的ID进行更新
        if (progressData[id]) {
            updateProgressBar(id); // 修改这里的参数，使用完整的id，如 'overlay-grade-1'
        } else {
            console.error(`无效的年级ID：${id}`);
        }
    } else {
        console.log(`找不到ID为 ${id} 的元素！`);
    }
}


function closeOverlay(id) {
    // 使用 `#kbs` 容器内的元素进行查找和操作
    const overlay = document.querySelector(`#kbs #${id}`);
    if (overlay) {
        overlay.style.display = 'none';
        sendProgressData();
    } else {
        console.log(`找不到ID为 ${id} 的元素！`);
    }
}

// 切换知识点学习状态
function toggleKnowledgePoint(grade, itemId) {
    const item = document.querySelector(`#kbs #${itemId}`);
    const progress = progressData[grade];

    if (!item) {
        console.error(`无法找到知识点元素：${itemId}`);
        return;
    }

    // 检查并切换 learned 类
    if (item.classList.contains('learned')) {
        item.classList.remove('learned');
        progress.learned--;
    } else {
        item.classList.add('learned');
        progress.learned++;
    }

    updateProgressBar(grade); // 更新进度条
}

// 更新进度条
function updateProgressBar(id) {
    const progress = progressData[id];
    if (!progress) {
        console.error(`无法找到年级数据：${id}`);
        return;
    }

    const circle = document.querySelector(`#kbs .${id.replace('overlay-', '')} .liquid`);
    const progressPercentage = (progress.learned / progress.total) * 100;

    if (circle) {
        circle.style.height = `${progressPercentage}%`;
    } else {
        console.error(`无法找到年级圆形内的液体元素：${id.replace('overlay-', '')}`);
    }

    // 更新进度文本
    const progressText = document.querySelector(`#kbs #progress-text-${id.replace('overlay-', '')}`);
    if (progressText) {
        progressText.textContent = `当前学习进度为 ${progress.learned} / ${progress.total} 继续加油！`;
    } else {
        console.error(`无法找到进度文本元素：progress-text-${id}`);
    }
}


// 初始化点击事件绑定到所有知识点
// 初始化点击事件绑定到所有知识点
// 初始化点击事件绑定到所有知识点
async function initializeKnowledgePoints() {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("____初始化函数执行");
            let data = [];
            data = await fetchProgressData();
            console.log("Fetched data:", data); // 确认获取的数据

            // 打印接收到的数据和progressData的长度
            console.log("接收到的数据长度:", data ? data.length : "未接收到数据");
            console.log("progressData年级数:", Object.keys(progressData).length);

            // 检查是否成功获取到数据
            if (!Array.isArray(data) || data.length !== Object.keys(progressData).length) {
                console.error("接收到的数据无效或长度不匹配 progressData 的年级数:", data);
                return reject("数据无效或不匹配");
            }

            // 将接收到的数据赋值到 progressData 中，并初始化 DOM 元素
            Object.keys(progressData).forEach((grade, index) => {
                const dataString = data[index];

                if (typeof dataString === 'string') {
                    const learnedCount = (dataString.match(/1/g) || []).length;
                    progressData[grade].learned = learnedCount;

                    // 遍历当前年级的知识点并根据数据设置其状态
                    progressData[grade].ids.forEach((itemId, idx) => {
                        const item = document.querySelector(`#kbs #${itemId}`);
                        if (item) {
                            if (dataString[idx] === '1') {
                                item.classList.add('learned'); // 将学过的知识点标记为learned
                            } else {
                                item.classList.remove('learned'); // 移除learned标记
                            }

                            // 在点击知识点时绑定 toggleKnowledgePoint 函数
                            item.addEventListener('click', () => toggleKnowledgePoint(grade, itemId));
                        } else {
                            console.error(`无法找到知识点元素：${itemId}`);
                        }
                    });

                    // 更新进度条
                    updateProgressBar(grade);

                } else {
                    console.error(`无效的字符串数据在索引 ${index}:`, dataString);
                }
            });

            resolve(); // 初始化成功
        } catch (error) {
            console.error("数据初始化失败:", error);
            reject(error); // 初始化失败
        }
    });
}

// 知识库
// 发送：userId(18) 
// 接受：知识库数据的获取
async function fetchProgressData() {
    const userId = localStorage.getItem('userId');
    const data = { userId: userId };

    try {
        const response = await fetch(localStorage.getItem('ipConfig') +'/users/knowledgeRoadMap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.message !== 'true') {
            throw new Error('后台处理失败');
        }

        console.log("Response from 知识库:", result.data);
        return result.data;

    } catch (error) {
        console.error('Error:', error);
        throw error; // 抛出错误，以便调用者处理
    }
}

// 将 progressData 的知识点状态转换为传入的数据格式并传输到后端
async function sendProgressData() {
    const userId = localStorage.getItem('userId');
    
    // 将 progressData 转换为需要的格式
    const dataToSend = Object.keys(progressData).map(grade => {
        const gradeData = progressData[grade];
        return gradeData.ids.map(id => {
            const item = document.querySelector(`#kbs #${id}`);
            return item && item.classList.contains('learned') ? '1' : '0';
        }).join('');
    });

    // 构造要发送的数据对象
    const data = {
        userId: userId,
        progressData: dataToSend
    };

    try {
        // 向后端发送数据
        const response = await fetch(localStorage.getItem('ipConfig') +'/users/updateKnowledgeRoadMap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.message !== 'true') {
            throw new Error('后台处理失败');
        }

        console.log("进度数据已成功发送到后端:", result);
    } catch (error) {
        console.error('Error sending progress data to backend:', error);
    }
}


// 注意！
// windows.onload不用于动态页面的调用提前执行
// 要在调用处使用 knowledgeJS.onload = function () {}
// // 页面加载完成后初始化
// window.onload = function() {
//     initializeKnowledgePoints();
// };
