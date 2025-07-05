<template>
  <!-- 全局顶部工具栏组件 -->
  <div class="global-toolbar">
    <div class="toolbar-logo">
      <img src="@/assets/jiyu.jpg" alt="Logo" class="logo-image">
      <h1 class="logo-text">积语伴学</h1>
    </div>
    
    <div class="toolbar-buttons">
      <el-button 
        v-for="(item, index) in navigationItems" 
        :key="index"
        text 
        @click="navigateTo(item.route)" 
        :class="{ active: isActive(item.route) }"
      >
        {{ item.label }}
      </el-button>
      
      <!-- 个性化学习下拉菜单 -->
      <div class="dropdown-container" @mouseover="showPersonalizedMenu = true" @mouseleave="showPersonalizedMenu = false">
        <el-button text>个性化学习</el-button>
        <div class="dropdown-menu" v-show="showPersonalizedMenu">
          <div class="dropdown-buttons">
            <el-button class="learn-btn" @click="$emit('feature-click', 'feynman')">
              费曼学习法
              <span class="description">用自己的语言解释所学知识来加深理解和记忆</span>
            </el-button>
            <el-button class="learn-btn" @click="$emit('feature-click', 'planning')">
              智能规划
              <span class="description">让AI来帮您定制学习路线吧！</span>
            </el-button>
            <el-button class="learn-btn" @click="$emit('feature-click', 'coming-soon')">
              敬请期待
              <span class="description">敬请期待多种学习方法</span>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="toolbar-settings">
      <span class="username-display">{{ username }}</span>
      <el-button :icon="Setting" circle @click="$emit('toggle-settings')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Setting } from '@element-plus/icons-vue'

// 属性定义
interface Props {
  extraNavItems?: { label: string; route: string }[] // 可选的额外导航项目
  hideItems?: string[] // 要隐藏的导航项目路由
}

const props = withDefaults(defineProps<Props>(), {
  extraNavItems: () => [],
  hideItems: () => []
})

// 事件
defineEmits<{
  'toggle-settings': [] // 切换设置侧边栏
  'feature-click': [feature: string] // 点击特性按钮
}>()

// 获取路由和认证状态
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 用户名
const username = computed(() => authStore.username || '用户')

// 导航菜单状态
const showPersonalizedMenu = ref(false)

// 默认导航项目
const defaultNavigationItems = [
  { label: '主界面', route: '/dashboard' },
  { label: '每日刷题', route: '/daily-practice' },
  { label: '智能问答', route: '/chat' },
  { label: '事项规划', route: '/planning' },
  { label: '批改订正', route: '/correction' },
  { label: '知识导航', route: '/navigator' }
]

// 计算最终显示的导航项目
const navigationItems = computed(() => {
  // 过滤掉要隐藏的项目
  const filtered = defaultNavigationItems.filter(item => !props.hideItems.includes(item.route))
  
  // 合并额外项目
  return [...filtered, ...props.extraNavItems]
})

// 导航方法
const navigateTo = (path: string) => {
  if (path !== route.path) {
    router.push(path)
  }
}

// 检查当前路由是否激活
const isActive = (path: string) => {
  return route.path === path
}
</script>

<style lang="scss" scoped>
.global-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  padding: 0 20px;
  transition: all 0.3s ease;
  
  .toolbar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .logo-image {
      height: 40px;
      border-radius: 50%;
    }
    
    .logo-text {
      font-size: 1.5rem;
      color: #1a17db;
      margin: 0;
    }
  }
  
  .toolbar-buttons {
    display: flex;
    gap: 10px;
    
    :deep(.el-button) {
      font-size: 16px;
      padding: 0 15px;
      height: 50px;
      
      &.active {
        color: #1a17db;
        font-weight: bold;
        background-color: rgba(26, 23, 219, 0.1);
        border-radius: 4px;
      }
    }
  }
  
  .toolbar-settings {
    display: flex;
    align-items: center;
    gap: 15px;
    
    .username-display {
      font-weight: bold;
      font-size: 16px;
      color: #1a17db;
    }
  }
}

// 下拉菜单样式
.dropdown-container {
  position: relative;
  z-index: 1200;
  
  .dropdown-menu {
    position: fixed;
    top: 50px;
    width: 80vw;
    left: 10vw;
    background-color: white;
    border-radius: 0 0 8px 8px;
    border-bottom: 2px solid #ddd;
    border-top: none;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1199;
    padding: 10px;
    
    .dropdown-buttons {
      display: flex;
      justify-content: center;
      gap: 40px;
      
      .learn-btn {
        background: none;
        border: 1px solid #ddd;
        padding: 10px 20px;
        font-size: 14px;
        color: #333;
        text-align: center;
        cursor: pointer;
        position: relative;
        transition: box-shadow 0.3s ease-in-out;
        border-radius: 6px;
        
        .description {
          display: block;
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        
        &:hover {
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          background-color: #f5f5f5;
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .global-toolbar {
    padding: 0 10px;
    
    .toolbar-logo {
      .logo-text {
        display: none;
      }
    }
    
    .toolbar-buttons {
      gap: 5px;
      
      :deep(.el-button) {
        font-size: 14px;
        padding: 0 8px;
      }
    }
    
    .toolbar-settings {
      .username-display {
        display: none;
      }
    }
  }
  
  .dropdown-container {
    .dropdown-menu {
      width: 95vw;
      left: 2.5vw;
      
      .dropdown-buttons {
        flex-direction: column;
        gap: 10px;
      }
    }
  }
}
</style>
