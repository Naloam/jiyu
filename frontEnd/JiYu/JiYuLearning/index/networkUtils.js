// 生成uuid 
export function generateCustomUUID() {
    const chars = '0123456789abcdef';
    
    function generateSegment(length) {
        let segment = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * 16);
            segment += chars[randomIndex];
        }
        return segment;
    }

    const firstSegment = generateSegment(4);  // 生成4位数字和字母组合
    const secondSegment = generateSegment(12); // 生成12位数字和字母组合

    return `-${firstSegment}-${secondSegment}`;
}

// 统一的后端地址
const ipConfig = 'http://aba.nat300.top';
// onst ipConfig = 'http://localhost:5000';
localStorage.setItem('ipConfig', ipConfig);

// 登录函数
export async function loginUser(username, password) {
    return fetch(ipConfig + '/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: username, password: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // 解析JSON响应
    })
    .then(data => {
        if (data.token) {
            return data.token; // 返回token
        } else {
            throw new Error('Token not found in response');
        }
    });
}

export async function signupUser(username, password, confirmPassword) {
    if (password !== confirmPassword) {
        return Promise.reject('密码和确认密码不匹配');
    }

    const data = {
        userName: username,
        password: password
    };

    return fetch(ipConfig + '/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('注册成功:', data);
        return data;
    })
    .catch(error => {
        console.error('注册失败:', error);
        throw error;
    });
}


// 普通对话模式：发送用户输入到后端的函数
// 发送：用户ID 对话ID 对话框类型 用户输入信息
// 接受：是否成功message 大模型输出botanswer
export async function sendUserInputN(conId, userinfo, step) {
    const userId = localStorage.getItem('userId');
    console.log("___用户id: " + userId);
    const data = {
        userId: userId,
        conId: conId,
        step: step,
        userinfo: userinfo
    };

    return fetch(ipConfig + '/chat/setuserN', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (data.message !== 'true') {
            throw new Error('后台处理失败');
        }
        console.log("Response from bot:", data.botanswer);
        console.log("Response from step:", data.step);
        return {
            botMessage: data.botanswer,
            step: data.step
        };
    })
    .catch(error => {
        console.error('Error:', error);
        throw error; // 抛出错误，以便调用者处理
    });
}

// 费曼学习模式：首次学习发送知识点 之后发用户输入
// 发送：用户ID 对话ID 知识点 用户输入 状态码 步数码
// 接受：是否成功message 大模型输出botanswer
export async function sendUserInputL(conId, knowledge, userinfo = null, stage, step) {
    const userId = localStorage.getItem('userId');
    const data = {
        userId: userId,
        conId: conId,
        knowledge: knowledge,
        userinfo: userinfo,
        stage: stage,
        step: step
    };

    return fetch(ipConfig + '/chat/setuserL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message !== 'true') {
            throw new Error('后台处理失败');
        }
        console.log("Response from bot:", data.botanswer);
        console.log("Response from stage:", data.stage);
        console.log("Response from step:", data.step);
        return { 
            botMessage: data.botanswer,
            stage: data.stage,
            step: data.step
        }; // 返回包含 message、stage 和 step 的对象
    })
    .catch(error => {
        console.error('Error:', error);
        throw error; // 抛出错误，以便调用者处理
    });
}

// 批改订正第一轮时
// 发送：userId(18) + converId(18) + 题目(第二轮为用户的输入) + 用户答案（只传第一轮） + 用户输入 + stage + step
// 接受：发送成功message + 大模型输出 + stage + step (每次对话更新)
export async function sendUserInputC(conId, question = null, answer = null, userinfo = null, stage, step) {
    const userId = localStorage.getItem('userId');
    const data = {
        userId: userId,
        conId: conId,
        question: question,
        answer: answer,
        userinfo: userinfo,
        stage: stage,
        step: step
    };

    return fetch(ipConfig + '/chat/setuserC', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message !== 'true') {
            throw new Error('后台处理失败');
        }
        console.log("Response from bot批改1:", data.botanswer);
        console.log("Response from stage批改1:", data.stage);
        console.log("Response from step批改1:", data.step);
        return { 
            botMessage: data.botanswer,
            stage: data.stage,
            step: data.step
        }; // 返回包含 message、stage 和 step 的对象
    })
    .catch(error => {
        console.error('Error:', error);
        throw error; // 抛出错误，以便调用者处理
    });
}

// OCR
// 发送：userId(18) + 图片二进制流
// 接受：大模型输出
export async function sendImageDataToBackend(image) {
    const userId = localStorage.getItem('userId');
    const data = {
        userId: userId,
        image: image
    };
    console.log("__发送图像" + image);
    
    try {
        // 使用fetch API将图像数据发送到后端
        const response = await fetch(ipConfig + '/chat/ocr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const resultData = await response.json(); // 等待响应解析为JSON

        if (resultData.message !== 'true') {
            throw new Error('后台处理失败');
        }
        
        console.log("Response from OCR:", resultData.output);
        return { 
            result: resultData.output
        }; // 返回包含 OCR 识别的文本

    } catch (error) {
        console.error('Error:', error);
        throw error; // 抛出错误，以便调用者处理
    }
}