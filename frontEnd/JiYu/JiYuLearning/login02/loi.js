let login = document.querySelector('.login')
let span
let btn = document.querySelector('button')


login.addEventListener('mouseenter', function(event) {
    span = document.createElement('span')
    login.appendChild(span)

    span.style.animation = 'in  .5s ease-out forwards'
    let left = event.clientX - event.target.offsetLeft
    let top = event.clientY - event.target.offsetTop


    span.style.left = left + 'px'
    span.style.top = top + 'px'
})

login.addEventListener('mouseleave', function(event) {
    span.style.animation = 'out  .5s ease-out forwards'

    let left = event.clientX - event.target.offsetLeft
    let top = event.clientY - event.target.offsetTop


    span.style.left = left + 'px'
    span.style.top = top + 'px'

})

btn.addEventListener('click', function(event) {
    alert('登陆成功！')
})