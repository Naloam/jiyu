window.size_simple=4;//简单题库的题目总数
let a0 = [];
window.sum_simple=a0;//每一次测验简单题库的正确数
let a1 = new Array(4).fill(0);
window.array_simple=a1;//简单题库的每一题是否正确
let s = [];
window.score=s;//每一次测验的成绩
window.size_test=0;//测验的次数
function submit(){
    sum=0;
    for(i=0;i<window.size_simple;i++){
        sum+=window.array_simple[i];
    }
    window.sum_simple[window.size_test]=sum;
    window.score.push(window.sum_simple[window.size_test]/window.size_simple*100.0);
    alert('答案已提交，您本次测试的成绩为: ' + window.score[window.size_test]+'/100 分');
    window.size_test++;
    console.log('测验次数为： '+window.size_test);
}

//第一题的点击事件
function click_1() {
    // 获取所有 name 为 s_1 的单选框
const radioButtons = document.querySelectorAll('input[name="s_1"]');
// 为每个单选框添加事件监听器
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function () {
        if (this.checked) {
            if (this.value === 'C') {//答案为C
                window.array_simple[0]=1;
            } else {
                window.array_simple[0]=0;
            }
        }
    });
});
}

//第二题的点击事件
function click_2() {
    // 获取所有 name 为 s_2 的单选框
const radioButtons = document.querySelectorAll('input[name="s_2"]');
// 为每个单选框添加事件监听器
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function () {
        if (this.checked) {
            if (this.value === 'D') {//答案为D
                window.array_simple[1]=1;
            } else {
                window.array_simple[1]=0;
            }
        }
    });
});
}

//第三题的点击事件
function click_3() {
    // 获取所有 name 为 s_3 的单选框
const radioButtons = document.querySelectorAll('input[name="s_3"]');
// 为每个单选框添加事件监听器
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function () {
        if (this.checked) {
            if (this.value === 'A') {
                window.array_simple[2]=1;
            } else {
                window.array_simple[2]=0;
            }
        }
    });
});
}

//第四题的点击事件
function click_4() {
    // 获取所有 name 为 s_4 的单选框
const radioButtons = document.querySelectorAll('input[name="s_4"]');
// 为每个单选框添加事件监听器
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function () {
        if (this.checked) {
            if (this.value === 'D') {
                window.array_simple[3]=1;
            } else {
                window.array_simple[3]=0;
            }
        }
    });
});
}