<template>
  <div class="login-test-page">
    <h1>登录页面测试</h1>
    <p>如果您能看到这个页面，说明Vue路由正常工作</p>
    <div class="test-box">
      <p>当前时间: {{ new Date().toLocaleString() }}</p>
      <el-button type="primary" @click="testAlert">测试按钮</el-button>
      <router-link to="/dashboard">跳转到Dashboard</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

const testAlert = () => {
  ElMessage.success('Element Plus 正常工作!')
}
</script>

<style scoped>
.login-test-page {
  padding: 50px;
  text-align: center;
  background-color: #f0f0f0;
  min-height: 100vh;
}

.test-box {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  max-width: 400px;
  margin: 20px auto;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}
</style>
