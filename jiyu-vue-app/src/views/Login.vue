<template>
  <!-- Debug: 确认 Login.vue 组件已渲染 -->
  <p style="position:absolute;top:0;left:0;background:rgba(255,0,0,0.7);color:#fff;z-index:1000;padding:4px;">DEBUG: Login.vue 渲染</p>
  <div class="login-page">
    <div class="login-container">
      <div class="login-form">
        <!-- Logo和标题 -->
        <div class="login-header">
          <div class="logo-container">
            <img src="@/assets/jiyu.jpg" alt="积语Logo" class="logo-image" />
          </div>
          <h1>积语伴学</h1>
          <p>您学习路上的好伴侣</p>
        </div>
        
        <!-- 登录表单 -->
        <el-form 
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          @submit.prevent="handleLogin"
          size="large"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              clearable
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              clearable
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          
          <el-form-item>
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary"
              size="large"
              :loading="authStore.isLoading"
              @click="handleLogin"
              style="width: 100%"
            >
              登录
            </el-button>
          </el-form-item>
          
          <!-- 开发测试用按钮，用于绕过登录验证 -->
          <el-form-item>
            <el-button 
              type="warning"
              size="large"
              @click="devBypassLogin"
              style="width: 100%"
            >
              开发测试（绕过登录）
            </el-button>
          </el-form-item>
        </el-form>
        
        <!-- 注册链接 -->
        <div class="login-footer">
          <p>还没有账号？<router-link to="/register" class="register-link">立即注册</router-link></p>
        </div>
      </div>
      
      <!-- 右侧装饰 -->
      <div class="login-decoration">
        <div class="decoration-content">
          <h2>开启智能学习之旅</h2>
          <ul class="feature-list">
            <li>🤖 AI智能问答</li>
            <li>📝 智能批改订正</li>
            <li>🧠 费曼学习法</li>
            <li>📊 个性化学习规划</li>
            <li>🎯 每日刷题挑战</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const rememberMe = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  try {
    const valid = await formRef.value.validate()
    if (!valid) return
    
    const result = await authStore.login({
      username: loginForm.username,
      password: loginForm.password
    })
    
    if (result.success) {
      ElMessage.success('登录成功')
      router.push('/dashboard')
    } else {
      ElMessage.error(result.message || '登录失败')
    }
  } catch (error) {
    console.error('Login error:', error)
    ElMessage.error('登录过程中发生错误')
  }
}

// 开发测试用，绕过登录验证
const devBypassLogin = () => {
  // 模拟登录成功的状态
  authStore.$patch({
    token: 'dev-mock-token',
    isAuthenticated: true,
    user: {
      id: 'dev-user-id',
      username: '测试用户',
      email: 'test@example.com',
      avatar: '',
      level: 3,
      experience: 245,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  })
  
  // 保存到localStorage，使刷新页面后状态仍然保持
  localStorage.setItem('jiyu_token', 'dev-mock-token')
  localStorage.setItem('jiyu_user', JSON.stringify(authStore.user))
  
  ElMessage.success('测试模式：已绕过登录验证')
  router.push('/dashboard')
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background-image: url('@/assets/bg.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.login-container {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 10px 10px 20px rgba(33, 44, 55, 0.3);
  overflow: hidden;
  width: 100%;
  max-width: 350px;
  min-height: 500px;
  position: relative;
  z-index: 100;
}

.login-form {
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
  
  .logo-container {
    margin-bottom: 20px;
    
    .logo-image {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
  
  h1 {
    font-size: 45px;
    font-weight: 400;
    z-index: 100;
    opacity: 0.6;
    font-family: 'Courier New', Courier, monospace;
    color: rgb(7, 7, 7);
    margin: 20px 0 10px;
  }
  
  p {
    font-size: 14px;
    font-weight: 400;
    z-index: 100;
    opacity: 0.9;
    font-family: 'Courier New', Courier, monospace;
    color: rgb(7, 7, 7);
    margin: 0;
  }
}

// Element Plus 表单样式覆盖 - 模仿原项目风格
:deep(.el-form-item) {
  margin-bottom: 25px;
}

:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.35);
  border: none;
  border-bottom: 2px solid #6ca8f0;
  border-radius: 0;
  box-shadow: none;
  
  .el-input__inner {
    font-size: 17px;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bolder;
    color: black;
    
    &::placeholder {
      font-size: 15px;
      font-family: 'Courier New', Courier, monospace;
      color: rgb(81, 169, 247);
    }
  }
}

:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus) {
  box-shadow: none;
  border-bottom-color: #409eff;
}

// 按钮样式 - 模仿原项目
:deep(.el-button--primary) {
  background-color: transparent;
  border: 0.15em solid #6ca8f0;
  border-radius: 15px;
  color: #6ca8f0;
  font-size: 14px;
  font-family: 'Courier New', Courier, monospace;
  width: 180px;
  height: 36px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s;
  
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: -1.5em;
    z-index: -1;
    width: 200%;
    aspect-ratio: 1;
    border: none;
    border-radius: 40%;
    background-color: #6ca8f0;
    transition: all 0.4s;
  }
  
  &::before {
    left: -80%;
    transform: translate3d(0, 5em, 0) rotate(-340deg);
  }
  
  &::after {
    right: -80%;
    transform: translate3d(0, 5em, 0) rotate(-390deg);
  }
  
  &:hover,
  &:focus {
    color: white;
    background-color: transparent;
    border-color: #6ca8f0;
    
    &::before,
    &::after {
      transform: none;
      background-color: #6ca8f0;
    }
  }
}

// 复选框样式
:deep(.el-checkbox) {
  .el-checkbox__label {
    font-family: 'Courier New', Courier, monospace;
    color: rgb(7, 7, 7);
    opacity: 0.8;
  }
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  
  p {
    color: rgb(7, 7, 7);
    margin: 0;
    font-family: 'Courier New', Courier, monospace;
    opacity: 0.8;
  }
  
  .register-link {
    color: #6ca8f0;
    text-decoration: none;
    font-weight: 500;
    font-family: 'Courier New', Courier, monospace;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-container {
    max-width: 300px;
    min-height: 450px;
  }
  
  .login-form {
    padding: 30px 25px;
  }
  
  .login-header h1 {
    font-size: 36px;
  }
}
</style>
