<template>
  <div class="dashboard">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <h1 class="app-title">积语伴学</h1>
      </div>
      <div class="toolbar-right">
        <div class="network-status" :class="{ offline: !isOnline }">
          <span v-if="isOnline" class="status-text">🟢 已连接</span>
          <span v-else class="status-text">🔴 网络断开</span>
        </div>
        <div class="user-info" v-if="authStore.user">
          <span class="username">{{ authStore.user.username }}</span>
          <div class="user-avatar">
            <img v-if="authStore.user.avatar" :src="authStore.user.avatar" alt="头像" />
            <span v-else class="avatar-placeholder">{{ authStore.user.username.charAt(0).toUpperCase() }}</span>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout">退出</button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <ScrollContainer class="main-content" height="calc(100vh - 60px)">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-container">
        <el-loading text="正在加载..." />
      </div>
      
      <!-- 欢迎区域 -->
      <div v-else class="welcome-section">
        <div class="welcome-card">
          <h2>欢迎使用积语伴学！</h2>
          <p v-if="authStore.user">欢迎回来，{{ authStore.user.username }}！</p>
          <p v-else>您的智能学习助手已准备就绪</p>
          <div class="quick-actions">
            <el-button type="primary" @click="$router.push('/chat')" :icon="ChatDotRound">
              智能问答
            </el-button>
            <el-button type="info" @click="$router.push('/guidebook')">使用指南</el-button>
          </div>
        </div>
      </div>
    </ScrollContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { ChatDotRound } from '@element-plus/icons-vue'
import ScrollContainer from '@/components/common/ScrollContainer.vue'

// 获取router和store
const router = useRouter()
const authStore = useAuthStore()

// 加载状态
const isLoading = ref(false)

// 网络状态监听
const isOnline = ref(navigator.onLine)

// 网络状态监听函数
const handleOnline = () => {
  isOnline.value = true
  ElMessage.success('网络连接已恢复')
}

const handleOffline = () => {
  isOnline.value = false
  ElMessage.warning('网络连接已断开')
}

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // 检查用户信息
  if (!authStore.user && authStore.isAuthenticated) {
    authStore.getUserInfo()
  }
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})

// 登出处理
const handleLogout = () => {
  console.log('Logout clicked')
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.dashboard {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #f5f7fa;
  overflow: hidden;
  font-family: 'Microsoft YaHei', sans-serif;
}

/* 顶部工具栏 */
.toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.app-title {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logout-btn {
  background: #f56c6c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

/* 主内容区域 */
.main-content {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
}

/* 欢迎区域 */
.welcome-section {
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100% - 60px);
}

.welcome-card {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.quick-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

/* 网络状态指示器 */
.network-status {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.05);
}

.status-text {
  font-size: 12px;
  color: #666;
}

.network-status.offline {
  background-color: rgba(255, 0, 0, 0.1);
}

.network-status.offline .status-text {
  color: #f56c6c;
}

/* 用户头像 */
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #409eff;
  color: white;
  font-weight: bold;
}

.avatar-placeholder {
  font-size: 16px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .welcome-card {
    padding: 20px;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .main-content {
    padding: 15px;
  }
}
</style>
