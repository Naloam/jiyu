window.size_hard=8;//困难题库的题目总数
let a2 = [];
window.sum_hard=a2;//每一次测验困难题库的正确数
let b2 = new Array(8).fill(0);
window.array_hard=b2;//困难题库的每一题是否正确
let s2 = [];
window.score_hard=s2;//每一次测验的成绩
window.size_test_hard=0;//测验的次数
function submit(){
    sum=0;
    for(i=0;i<window.size_hard;i++){
        sum+=window.array_hard[i];
    }
    window.sum_hard[window.size_test_hard]=sum;
    window.score_hard.push(window.sum_hard[window.size_test_hard]/window.size_hard*100.0);
    alert('答案已提交，您本次测试的成绩为: ' + window.score_hard[window.size_test_hard]+'/100 分');
    window.size_test_hard++;
    console.log('测验次数为： '+window.size_test_hard);
}

//第一题的点击事件
function click_1() {
    // 获取所有 name 为 s_1 的单选框
const radioButtons = document.querySelectorAll('input[name="s_1"]');
// 为每个单选框添加事件监听器
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function () {
        if (this.checked) {
            if (this.value === 'A') {//答案为C
                window.array_hard[0]=1;
            } else {
                window.array_hard[0]=0;
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
            if (this.value === 'C') {//答案为D
                window.array_hard[1]=1;
            } else {
                window.array_hard[1]=0;
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
            if (this.value === 'D') {
                window.array_hard[2]=1;
            } else {
                window.array_hard[2]=0;
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
            if (this.value === 'A') {
                window.array_hard[3]=1;
            } else {
                window.array_hard[3]=0;
            }
        }
    });
});
}

function click_5() {
const radioButtons = document.querySelectorAll('input[name="s_5"]');
// 为每个单选框添加事件监听器
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function () {
        if (this.checked) {
            if (this.value === 'B') {
                window.array_hard[4]=1;
            } else {
                window.array_hard[4]=0;
            }
        }
    });
});
}

function click_6() {
const radioButtons = document.querySelectorAll('input[name="s_6"]');
// 为每个单选框添加事件监听器
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function () {
        if (this.checked) {
            if (this.value === 'A') {
                window.array_hard[5]=1;
            } else {
                window.array_hard[5]=0;
            }
        }
    });
});
}

function click_7() {
const radioButtons = document.querySelectorAll('input[name="s_7"]');
// 为每个单选框添加事件监听
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function () {
        if (this.checked) {
            if (this.value === 'B') {
                window.array_hard[6]=1;
            } else {
                window.array_hard[6]=0;
            }
        }
    });
});
}

function click_8() {
const radioButtons = document.querySelectorAll('input[name="s_8"]');
// 为每个单选框添加事件监听
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function () {
        if (this.checked) {
            if (this.value === 'A') {
                window.array_hard[7]=1;
            } else {
                window.array_hard[7]=0;
            }
        }
    });
});
}