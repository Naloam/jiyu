<template>
  <div class="login-page-fixed">
    <div class="login-container-fixed">
      <div class="login-form-fixed">
        <!-- Logo和标题 -->
        <div class="login-header-fixed">
          <div class="logo-container-fixed">
            <img src="@/assets/jiyu.jpg" alt="积语Logo" class="logo-image-fixed" />
          </div>
          <h1 class="title-fixed">积语伴学</h1>
          <p class="subtitle-fixed">您学习路上的好伴侣</p>
        </div>
        
        <!-- 登录表单 -->
        <el-form 
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          @submit.prevent="handleLogin"
          size="large"
          class="form-fixed"
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
        <div class="login-footer-fixed">
          <p>还没有账号？<router-link to="/register" class="register-link-fixed">立即注册</router-link></p>
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

const devBypassLogin = () => {
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
  
  localStorage.setItem('jiyu_token', 'dev-mock-token')
  localStorage.setItem('jiyu_user', JSON.stringify(authStore.user))
  
  ElMessage.success('测试模式：已绕过登录验证')
  router.push('/dashboard')
}
</script>

<style scoped>
/* 简化但保持原始设计风格的样式 */
.login-page-fixed {
  min-height: 100vh;
  width: 100%;
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
  z-index: 0;
}

.login-container-fixed {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 10;
}

.login-form-fixed {
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-header-fixed {
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
}

.logo-container-fixed {
  margin-bottom: 20px;
}

.logo-image-fixed {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.title-fixed {
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin: 15px 0 10px;
  font-family: 'Arial', sans-serif;
}

.subtitle-fixed {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.form-fixed {
  width: 100%;
}

.login-footer-fixed {
  text-align: center;
  margin-top: 20px;
  width: 100%;
}

.login-footer-fixed p {
  color: #666;
  margin: 0;
}

.register-link-fixed {
  color: #409eff;
  text-decoration: none;
  font-weight: 500;
}

.register-link-fixed:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container-fixed {
    max-width: 350px;
  }
  
  .login-form-fixed {
    padding: 30px 25px;
  }
  
  .title-fixed {
    font-size: 28px;
  }
}
</style>
