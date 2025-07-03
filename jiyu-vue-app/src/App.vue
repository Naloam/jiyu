<template>
  <div id="app" class="app-container">
    <!-- DEBUG: App.vue 渲染 -->
    <div style="position:absolute;top:0;right:0;background:red;color:#fff;padding:4px;z-index:999">DEBUG App</div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  console.log('App mounted, checking auth state...')
  
  // 检查token和用户信息状态
  const token = localStorage.getItem('jiyu_token')
  const userStr = localStorage.getItem('jiyu_user')
  
  if (token && !authStore.token) {
    // 恢复token状态
    authStore.token = token
  }
  
  if (userStr && !authStore.user) {
    try {
      authStore.user = JSON.parse(userStr)
      authStore.isAuthenticated = true
    } catch (error) {
      console.error('Parse user info failed:', error)
      localStorage.removeItem('jiyu_user')
    }
  }
  
  // 如果有token但没有用户信息，尝试获取用户信息
  if (authStore.token && !authStore.user) {
    console.log('Getting user info...')
    const success = await authStore.getUserInfo()
    if (!success) {
      console.log('Get user info failed, redirect to login')
      authStore.logout()
      if (router.currentRoute.value.meta.requiresAuth) {
        router.push('/login')
      }
    }
  }
  
  console.log('Auth state:', {
    token: !!authStore.token,
    user: !!authStore.user,
    isAuthenticated: authStore.isAuthenticated
  })
})
</script>

<style>
.app-container {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: auto;
  position: relative;
}
</style>
