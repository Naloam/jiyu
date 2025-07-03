<template>
  <div class="scroll-container" ref="scrollContainer" @scroll="handleScroll">
    <div class="scroll-content">
      <slot />
    </div>
    
    <!-- 返回顶部按钮 -->
    <el-backtop 
      :target="scrollContainer"
      :visibility-height="200"
      :right="40"
      :bottom="40"
    >
      <div class="backtop-button">
        <el-icon :size="20">
          <ArrowUp />
        </el-icon>
      </div>
    </el-backtop>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUp } from '@element-plus/icons-vue'

// Props
interface Props {
  height?: string
  maxHeight?: string
  showBackTop?: boolean
  backTopVisibilityHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: '100vh',
  maxHeight: '100vh',
  showBackTop: true,
  backTopVisibilityHeight: 200
})

// Refs
const scrollContainer = ref<HTMLElement>()
const showBackTopButton = ref(false)

// Emits
const emit = defineEmits<{
  scroll: [event: Event]
  scrollToTop: []
  scrollToBottom: []
}>()

// 滚动处理
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  const scrollTop = target.scrollTop
  const scrollHeight = target.scrollHeight
  const clientHeight = target.clientHeight
  
  // 显示/隐藏返回顶部按钮
  showBackTopButton.value = scrollTop > props.backTopVisibilityHeight
  
  // 发出滚动事件
  emit('scroll', event)
  
  // 检查是否滚动到顶部或底部
  if (scrollTop === 0) {
    console.log('已滚动到顶部')
  }
  
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    emit('scrollToBottom')
    console.log('已滚动到底部')
  }
}

// 滚动到顶部
const scrollToTop = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    emit('scrollToTop')
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

// 滚动到指定位置
const scrollTo = (top: number, behavior: ScrollBehavior = 'smooth') => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top,
      behavior
    })
  }
}

// 暴露方法
defineExpose({
  scrollToTop,
  scrollToBottom,
  scrollTo,
  scrollContainer
})

onMounted(() => {
  console.log('ScrollContainer 组件已挂载')
})

onUnmounted(() => {
  console.log('ScrollContainer 组件已卸载')
})
</script>

<style scoped>
.scroll-container {
  position: relative;
  width: 100%;
  height: v-bind(height);
  max-height: v-bind(maxHeight);
  overflow-y: auto;
  overflow-x: hidden;
}

.scroll-content {
  min-height: 100%;
  padding-bottom: 20px; /* 确保底部有足够空间 */
}

/* 自定义滚动条样式 */
.scroll-container::-webkit-scrollbar {
  width: 8px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #c1c4c9;
  border-radius: 4px;
  transition: background 0.3s;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* 返回顶部按钮样式 */
.backtop-button {
  width: 40px;
  height: 40px;
  background: #409eff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s;
  cursor: pointer;
}

.backtop-button:hover {
  background: #337ecc;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .scroll-container {
    height: calc(100vh - 60px); /* 减去顶部导航栏高度 */
  }
  
  .backtop-button {
    width: 36px;
    height: 36px;
  }
}

/* Firefox 滚动条样式 */
.scroll-container {
  scrollbar-width: thin;
  scrollbar-color: #c1c4c9 #f5f7fa;
}
</style>
