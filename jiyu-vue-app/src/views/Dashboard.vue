<template>
  <div class="dashboard">
    <!-- 背景图片 -->
    <div class="background"></div>
    <!-- 全局顶部工具栏 -->
    <GlobalToolbar 
      @toggle-settings="handleSettings"
    />

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
import GlobalToolbar from '@/components/common/GlobalToolbar.vue'

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

// 设置处理
const handleSettings = () => {
  // 仪表盘页面设置处理
  ElMessage.info('设置功能即将上线')
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

/* 主内容区域 */
.main-content {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
}

/* 背景 */
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/img/bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.5;
  z-index: -1;
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
