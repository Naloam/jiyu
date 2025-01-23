import {getIdByUsername} from '../index/utils/queryUser';
import {getNameByUsername} from '../index/utils/queryUser';
const inputElement = document.getElementById('i1');
// 修改 input 元素的值
inputElement.value = localStorage.getItem('username');
export function getId(){
    getIdByUsername();
    const inputElement = document.getElementById('i2');
    // 修改 input 元素的值
    inputElement.value = localStorage.getItem('id');
}
export function getName(){
    getNameByUsername();
    const inputElement = document.getElementById('i3');
    // 修改 input 元素的值
    inputElement.value = localStorage.getItem('name');
}