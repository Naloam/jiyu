<template>
  <div class="simple-login-page">
    <div class="simple-container">
      <h1>登录页面诊断</h1>
      
      <div class="debug-info">
        <h3>系统状态检查:</h3>
        <ul>
          <li>Vue 版本: {{ vueVersion }}</li>
          <li>Element Plus 状态: <el-tag type="success">正常</el-tag></li>
          <li>路由状态: {{ $route.path }}</li>
          <li>认证状态: {{ authStore.isAuthenticated ? '已登录' : '未登录' }}</li>
          <li>Token: {{ authStore.token ? '存在' : '不存在' }}</li>
        </ul>
      </div>
      
      <div class="test-section">
        <h3>功能测试:</h3>
        <el-button type="primary" @click="testElementPlus">测试 Element Plus</el-button>
        <el-button type="success" @click="testRouter">测试路由跳转</el-button>
        <el-button type="warning" @click="testStore">测试 Store</el-button>
      </div>
      
      <div class="assets-test">
        <h3>资源测试:</h3>
        <div class="asset-item">
          <p>背景图片:</p>
          <div class="bg-test" :style="{ backgroundImage: 'url(@/assets/bg.jpg)' }">
            背景图片测试区域
          </div>
        </div>
        <div class="asset-item">
          <p>Logo 图片:</p>
          <img src="@/assets/jiyu.jpg" alt="Logo" class="logo-test" />
        </div>
      </div>
      
      <div class="style-test">
        <h3>样式测试:</h3>
        <div class="color-test aqua-bg">青色背景测试</div>
        <div class="color-test transparent-bg">透明背景测试</div>
      </div>
      
      <div class="original-login-test">
        <h3>原始登录组件测试:</h3>
        <el-button type="danger" @click="goToOriginalLogin">访问原始登录页面</el-button>
        <el-button type="info" @click="showLoginComponentInline">内联显示登录组件</el-button>
      </div>
      
      <div v-if="showInlineLogin" class="inline-login">
        <h4>内联登录组件:</h4>
        <OriginalLogin />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, version } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import OriginalLogin from './Login.vue'

const router = useRouter()
const authStore = useAuthStore()
const vueVersion = version
const showInlineLogin = ref(false)

const testElementPlus = () => {
  ElMessage({
    message: 'Element Plus 工作正常!',
    type: 'success',
  })
}

const testRouter = () => {
  ElMessage.info('准备跳转到 Dashboard...')
  setTimeout(() => {
    router.push('/dashboard')
  }, 1000)
}

const testStore = () => {
  console.log('Auth Store 状态:', authStore)
  ElMessage.info(`认证状态: ${authStore.isAuthenticated}`)
}

const goToOriginalLogin = () => {
  router.push('/login')
}

const showLoginComponentInline = () => {
  showInlineLogin.value = !showInlineLogin.value
}
</script>

<style scoped>
.simple-login-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.simple-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

h3 {
  color: #666;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.debug-info, .test-section, .assets-test, .style-test, .original-login-test {
  margin: 20px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 5px;
}

.debug-info ul {
  list-style: none;
  padding: 0;
}

.debug-info li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.test-section {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.asset-item {
  margin: 10px 0;
}

.bg-test {
  width: 200px;
  height: 100px;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
  background-size: cover;
  background-position: center;
}

.logo-test {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.color-test {
  width: 200px;
  height: 60px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ddd;
  font-weight: bold;
}

.aqua-bg {
  background-color: aqua;
}

.transparent-bg {
  background-color: rgba(255, 255, 255, 0.95);
}

.inline-login {
  margin-top: 20px;
  padding: 20px;
  border: 2px solid #409eff;
  border-radius: 10px;
}
</style>
