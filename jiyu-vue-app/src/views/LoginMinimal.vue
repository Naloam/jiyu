<template>
  <div class="minimal-login-page">
    <div class="minimal-container">
      <h1>积语伴学</h1>
      <el-form :model="form" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input v-model="form.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" style="width: 100%">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="debug-section">
        <h3>调试信息</h3>
        <p>当前路由: {{ $route.path }}</p>
        <p>表单数据: {{ JSON.stringify(form) }}</p>
        <p>页面是否可见: 是</p>
        
        <div class="nav-buttons">
          <el-button @click="$router.push('/login')">原始登录页</el-button>
          <el-button @click="$router.push('/dashboard')">仪表板</el-button>
          <el-button @click="$router.push('/chat')">聊天页面</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = () => {
  console.log('登录表单提交:', form)
  
  // 模拟登录成功
  authStore.$patch({
    token: 'minimal-test-token',
    isAuthenticated: true,
    user: {
      id: 'test',
      username: form.username || '测试用户',
      email: 'test@test.com',
      avatar: '',
      level: 1,
      experience: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  })
  
  localStorage.setItem('jiyu_token', 'minimal-test-token')
  localStorage.setItem('jiyu_user', JSON.stringify(authStore.user))
  
  ElMessage.success('登录成功 (测试模式)')
  router.push('/dashboard')
}
</script>

<style scoped>
.minimal-login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.minimal-container {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.debug-section {
  margin-top: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 5px;
}

.debug-section h3 {
  margin-top: 0;
  color: #666;
}

.nav-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.nav-buttons .el-button {
  flex: 1;
  min-width: 80px;
}
</style>
