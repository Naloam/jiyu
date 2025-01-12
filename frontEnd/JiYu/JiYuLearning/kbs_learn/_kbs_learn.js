const progressData_learn = {
    'overlay-grade-1': { learned: 0, total: 6, ids: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] },
    'overlay-grade-2': { learned: 0, total: 13, ids: ['item7', 'item8', 'item9', 'item10', 'item11', 'item12', 'item13', 'item14', 'item15', 'item16', 'item17', 'item18', 'item19'] },
    'overlay-grade-3': { learned: 0, total: 17, ids: ['item20', 'item21', 'item22', 'item23', 'item24', 'item25', 'item26', 'item27', 'item28', 'item29', 'item30', 'item31', 'item32', 'item33', 'item34', 'item35', 'item36'] },
    'overlay-grade-4': { learned: 0, total: 16, ids: ['item37', 'item38', 'item39', 'item40', 'item41', 'item42', 'item43', 'item44', 'item45', 'item46', 'item47', 'item48', 'item49', 'item50', 'item51', 'item52'] },
    'overlay-grade-5': { learned: 0, total: 13, ids: ['item53', 'item54', 'item55', 'item56', 'item57', 'item58', 'item59', 'item60', 'item61', 'item62', 'item63', 'item64', 'item65'] },
    'overlay-grade-6': { learned: 0, total: 12, ids: ['item66', 'item67', 'item68', 'item69', 'item70', 'item71', 'item72', 'item73', 'item74', 'item75', 'item76', 'item77'] }
};

let knowledge = "";

// 显示悬浮页面的同时更新进度条
function showOverlay_learn(id) {
    const overlay = document.querySelector(`#kbs_learn #${id}`);
    if (overlay) {
        overlay.style.display = 'flex';
        
        // 不再提取年级部分，直接使用完整的ID传递
        console.log(`显示悬浮页面：${id}`);
        
        // 直接使用完整的ID进行更新
        if (progressData_learn[id]) {
            updateProgressBar_learn(id); // 修改这里的参数，使用完整的id，如 'overlay-grade-1'
        } else {
            console.error(`无效的年级ID：${id}`);
        }
    } else {
        console.log(`找不到ID为 ${id} 的元素！`);
    }
}


function closeOverlay_learn(id) {
    // 使用 `#kbs` 容器内的元素进行查找和操作
    const overlay = document.querySelector(`#kbs_learn #${id}`);
    if (overlay) {
        overlay.style.display = 'none';
    } else {
        console.log(`找不到ID为 ${id} 的元素！`);
    }
}

function toggleKnowledgePoint_learn(itemId, callback, container) {
    const item = document.querySelector(`#kbs_learn #${itemId}`);

    if (!item) {
        console.error(`无法找到知识点元素：${itemId}`);
        return;
    }

    // 获取知识点文本内容
    const knowledge = item.textContent;
    console.log(`知识点按钮文本：${knowledge}`);

    // 通过回调函数传递 `knowledge`
    if (typeof callback === 'function') {
        callback(knowledge);
    }

    // 隐藏或移除动态加载的页面元素
    if (container) {
        container.classList.remove('fade-in');
        container.classList.add('fade-out');

        // 在动画结束后移除元素
        setTimeout(() => {
            container.remove();
        }, 300); // 300ms 与 CSS 中的过渡时间匹配
    }
}


// 更新进度条
// 更新进度条
function updateProgressBar_learn(id) {
    const progress = progressData_learn[id];
    if (!progress) {
        console.error(`无法找到年级数据：${id}`);
        return;
    }

    const circle = document.querySelector(`#kbs_learn .${id.replace('overlay-', '')} .liquid`);
    const progressPercentage = (progress.learned / progress.total) * 100;

    if (circle) {
        circle.style.height = `${progressPercentage}%`;
    } else {
        console.error(`无法找到年级圆形内的液体元素：${id.replace('overlay-', '')}`);
    }

    // 更新进度文本
    const progressText = document.querySelector(`#kbs_learn #progress-text-${id.replace('overlay-', '')}`);
    if (progressText) {
        progressText.textContent = `当前学习进度为 ${progress.learned} / ${progress.total} 继续加油！`;
    } else {
        console.error(`无法找到进度文本元素：progress-text-${id}`);
    }
}

// 初始化点击事件绑定到所有知识点
async function initializeKnowledgePoints_learn(callback, container) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("____初始化函数执行");

            // 这里可以模拟或实际获取 progressData_learn 的数据
            const data = await fetchProgressData_learn(); // 假设有一个 fetchProgressData_learn 函数

            // 检查是否成功获取到数据
            if (!Array.isArray(data) || data.length !== Object.keys(progressData_learn).length) {
                console.error("接收到的数据无效或长度不匹配 progressData_learn 的年级数:", data);
                return reject("数据无效或不匹配");
            }

            // 将接收到的数据赋值到 progressData_learn 中，并初始化 DOM 元素
            Object.keys(progressData_learn).forEach((grade, index) => {
                const dataString = data[index];

                if (typeof dataString === 'string') {
                    const learnedCount = (dataString.match(/1/g) || []).length;
                    progressData_learn[grade].learned = learnedCount;

                    // 遍历当前年级的知识点并根据数据设置其状态
                    progressData_learn[grade].ids.forEach((itemId, idx) => {
                        const item = document.querySelector(`#kbs_learn #${itemId}`);
                        if (item) {
                            if (dataString[idx] === '1') {
                                item.classList.add('learned'); // 将学过的知识点标记为learned
                            } else {
                                item.classList.remove('learned'); // 移除learned标记
                            }

                            // 在点击知识点时绑定 toggleKnowledgePoint_learn 函数，并传递回调函数和容器
                            item.addEventListener('click', () => toggleKnowledgePoint_learn(itemId, callback, container));
                        } else {
                            console.error(`无法找到知识点元素：${itemId}`);
                        }
                    });

                    // 更新进度条
                    updateProgressBar_learn(grade);

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
async function fetchProgressData_learn() {
    const userId = localStorage.getItem('userId');
    const data = { userId: userId };

    try {
        const response = await fetch(localStorage.getItem('ipConfig') + '/users/knowledgeRoadMap', {
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

// 注意！
// windows.onload不用于动态页面的调用提前执行
// 要在调用处使用 knowledgeJS.onload = function () {}
// // 页面加载完成后初始化
// window.onload = function() {
//     initializeKnowledgePoints();
// };
