let img = document.querySelector('.img')
let deg = 0
let imgy = 0
let imgx = 0
let imgt = 0
let imgl = 0
let y = 0
let index = 0
let md = 0
let up = 0;
let cont = ['你好，我是积语', '我能为你做什么？','来开始今天的练习吧！','今天刷题太久了，休息一下吧！']
const parentDiv = document.getElementById('parentDiv');

const btn = document.getElementById('mypet')




btn.addEventListener('mousedown', function(xyz) {
    //console.log('鼠标在按钮上按下');
    md = 1;
    up = 0;
    dia = document.getElementsByClassName('dialog');
    for (let i = 0; i < dia.length; i++) {
        dia[i].style.display = 'none';
    }
    //img.style.backgroundImage = 'url(./lilpet.gif)'

})


btn.addEventListener('mouseup', function(xyz) {
    //console.log('鼠标在按钮上松开');
    //up=1;
    md = 0;
    //img.style.backgroundImage = 'url(./lilp.png)'
    setTimeout(function() {


        // img.style.backgroundImage = 'url(./lilpet.gif)';
        img.style.transform = 'scalX(-1)';

    }, 3000)

})

window.addEventListener('mousemove', function(xyz) {


    imgx = xyz.x - img.offsetLeft - img.clientWidth / 2
    imgy = xyz.y - img.offsetTop - img.clientHeight / 2

    index = 0

    let x = event.clientX

    if (img.offsetleft < x) {
        y = -100
    } else {
        y = 0
    }

})

setInterval(() => {
    if (md == 1) {
        index++;
        if (index < 10) {
            imgt += imgy / 10
            imgl += imgx / 10
        }
        img.style.left = imgl + 'px'
        img.style.top = imgt + 'px'
    }
}, 10)

btn.addEventListener('contextmenu', function(event) {


    console.log('鼠标右键在该元素上被点击');
    // 阻止默认的上下文菜单显示（可选操作）
    event.preventDefault();

    const dialog = document.createElement('div');
    dialog.className = 'dialog';





    //dialog.herf=''

    // 获取点击元素的位置信息
    const offsetTop = event.target.offsetTop;
    const offsetLeft = event.target.offsetLeft;
    const buttonWidth = event.target.offsetWidth;
    const buttonHeight = event.target.offsetHeight;

    // 设置对话框在父元素中的位置（这里示例将其显示在点击元素下方）
    dialog.style.position = 'absolute';
    dialog.style.top = offsetTop + buttonHeight + 5 + 'px';
    dialog.style.left = offsetLeft + buttonWidth / 2 - dialog.offsetWidth / 2 + 'px';

    // 将对话框添加到点击元素的父元素（parentDiv）中



    // const hef1 = document.createElement('a');
    // hef1.textContent = 'login';
    // hef1.href = '#';
    //
    // const hef2 = document.createElement('a');
    // hef2.textContent = '教材';
    // hef2.href = '#';
    //
    // dialog.appendChild(hef1);
    // dialog.appendChild(hef2);

    const pword = document.createElement('p');

    pword.className = 'typing';

    pword.textContent = cont[Math.floor(Math.random() * 4)];

    parentDiv.appendChild(dialog);

    dialog.appendChild(pword);


});