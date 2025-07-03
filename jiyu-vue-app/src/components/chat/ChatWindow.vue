<template>
  <div 
    class="chat-window"
    :class="{ 
      'fullscreen': window.isFullscreen,
      'minimized': window.isMinimized,
      'loading': window.isLoading
    }"
    :style="windowStyle"
    ref="windowRef"
  >
    <!-- 窗口头部 -->
    <div class="chat-header" @mousedown="startDrag">
      <div class="header-left">
        <el-icon class="window-icon" :color="getTypeColor(window.type)">
          <component :is="getTypeIcon(window.type)" />
        </el-icon>
        <span class="window-title">{{ window.title }}</span>
        <el-tag 
          :type="getTypeTagType(window.type)" 
          size="small"
          round
        >
          {{ getTypeLabel(window.type) }}
        </el-tag>
      </div>
      
      <div class="header-right">
        <el-button-group size="small">
          <el-button 
            :icon="HistoryIcon"
            @click="showHistory"
            title="历史记录"
          />
          <el-button 
            :icon="window.isFullscreen ? FullScreen : FullScreen"
            @click="$emit('toggle-fullscreen', window.id)"
            :title="window.isFullscreen ? '还原' : '全屏'"
          />
          <el-button 
            :icon="Minus"
            @click="$emit('minimize', window.id)"
            title="最小化"
          />
          <el-button 
            :icon="Close"
            @click="$emit('close', window.id)"
            title="关闭"
            type="danger"
          />
        </el-button-group>
      </div>
    </div>
    
    <!-- 聊天内容区域 -->
    <div class="chat-content" ref="contentRef">
      <div class="messages-container">
        <div 
          v-for="message in window.messages"
          :key="message.id"
          class="message-item"
          :class="{ 
            'user-message': message.type === 'user',
            'bot-message': message.type === 'bot',
            'system-message': message.type === 'system'
          }"
        >
          <!-- 用户消息 -->
          <div v-if="message.type === 'user'" class="user-message-content">
            <div class="message-avatar">
              <el-avatar :size="32" :src="userAvatar">
                {{ username.charAt(0) }}
              </el-avatar>
            </div>
            <div class="message-bubble user-bubble">
              <div class="message-text">{{ message.content }}</div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
          
          <!-- AI消息 -->
          <div v-else-if="message.type === 'bot'" class="bot-message-content">
            <div class="message-avatar">
              <el-avatar :size="32" class="bot-avatar">
                <el-icon><Robot /></el-icon>
              </el-avatar>
            </div>
            <div class="message-bubble bot-bubble">
              <div v-if="message.isTyping" class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div v-else class="message-text" v-html="formatMessage(message.content)"></div>
              <div v-if="!message.isTyping" class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div v-if="window.type !== 'material'" class="chat-input">
      <div class="input-container">
        <!-- 文件上传按钮 -->
        <el-upload
          v-if="window.type === 'correction'"
          class="upload-button"
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          @change="handleFileUpload"
        >
          <el-button :icon="PaperclipIcon" circle size="small" />
        </el-upload>
        
        <!-- 文本输入框 -->
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="2"
          :placeholder="getInputPlaceholder(window.type)"
          @keydown.enter.exact="handleSend"
          @keydown.ctrl.enter.exact="insertNewline"
          :disabled="window.isLoading"
          resize="none"
          class="message-input"
        />
        
        <!-- 发送按钮 -->
        <el-button 
          type="primary"
          :icon="Send"
          @click="handleSend"
          :loading="window.isLoading"
          :disabled="!inputText.trim()"
          class="send-button"
        >
          发送
        </el-button>
      </div>
    </div>
    
    <!-- 材料展示区域 -->
    <div v-else class="material-viewer">
      <iframe 
        :src="window.materialUrl"
        frameborder="0"
        class="material-iframe"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import type { ChatWindow, SendMessageRequest } from '@/types/chat'
import {
  Close, Minus, FullScreen, Compass as Compress, Promotion as Send, User as Robot,
  ChatDotRound, EditPen, Reading, DocumentChecked,
  Document as HistoryIcon, Paperclip as PaperclipIcon
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Props {
  window: ChatWindow
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'close': [id: string]
  'minimize': [id: string]  
  'toggle-fullscreen': [id: string]
  'send': [request: SendMessageRequest]
}>()

const authStore = useAuthStore()
const chatStore = useChatStore()
const windowRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const inputText = ref('')

// 计算属性
const username = computed(() => authStore.username)
const userAvatar = computed(() => authStore.avatar)

const windowStyle = computed(() => {
  if (props.window.isFullscreen) {
    return {
      position: 'fixed' as const,
      top: '60px',
      left: '0',
      width: '100vw',
      height: 'calc(100vh - 60px)',
      zIndex: 1001
    }
  }
  
  if (props.window.isMinimized) {
    return {
      position: 'fixed' as const,
      bottom: '20px',
      right: '20px',
      width: '200px',
      height: '40px',
      zIndex: 1000
    }
  }
  
  return {
    position: 'absolute' as const,
    left: props.window.position.left,
    top: props.window.position.top,
    width: '500px',
    height: '600px',
    zIndex: 999
  }
})

// 方法
const getTypeIcon = (type: ChatWindow['type']) => {
  const icons = {
    normal: ChatDotRound,
    correction: EditPen,
    feynman: Reading,
    material: Reading,
    homework: DocumentChecked
  }
  return icons[type]
}

const getTypeColor = (type: ChatWindow['type']) => {
  const colors = {
    normal: '#409EFF',
    correction: '#E6A23C',
    feynman: '#67C23A',
    material: '#909399',
    homework: '#F56C6C'
  }
  return colors[type]
}

const getTypeTagType = (type: ChatWindow['type']) => {
  const types = {
    normal: 'primary',
    correction: 'warning',
    feynman: 'success',
    material: 'info',
    homework: 'danger'
  } as const
  return types[type]
}

const getTypeLabel = (type: ChatWindow['type']) => {
  const labels = {
    normal: '问答',
    correction: '批改',
    feynman: '学习',
    material: '资料',
    homework: '练习'
  }
  return labels[type]
}

const getInputPlaceholder = (type: ChatWindow['type']) => {
  const placeholders = {
    normal: '请输入您的问题...',
    correction: '请描述需要批改的内容，或直接上传图片...',
    feynman: '请告诉我您想要学习的知识点...',
    homework: '请输入您的答案...',
    material: ''
  }
  return placeholders[type]
}

const formatMessage = (content: string) => {
  // 简单的markdown渲染
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 小于1分钟显示"刚刚"
  if (diff < 60000) {
    return '刚刚'
  }
  
  // 小于1小时显示分钟
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  }
  
  // 小于1天显示小时
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  }
  
  // 其他显示具体时间
  return date.toLocaleTimeString()
}

const handleSend = () => {
  if (!inputText.value.trim() || props.window.isLoading) return
  
  const request: SendMessageRequest = {
    chatId: props.window.id,
    type: props.window.type,
    content: inputText.value.trim(),
    knowledge: props.window.knowledge,
    problem: props.window.problem
  }
  
  emit('send', request)
  inputText.value = ''
}

const insertNewline = () => {
  inputText.value += '\n'
}

const handleFileUpload = (file: any) => {
  console.log('File uploaded:', file)
  // TODO: 处理文件上传
}

const showHistory = () => {
  ElMessage.info('历史记录功能开发中...')
}

// 拖拽功能
let isDragging = false
let startX = 0
let startY = 0
let startLeft = 0
let startTop = 0

const startDrag = (e: MouseEvent) => {
  if (props.window.isFullscreen || props.window.isMinimized) return
  
  isDragging = true
  startX = e.clientX
  startY = e.clientY
  startLeft = parseInt(props.window.position.left)
  startTop = parseInt(props.window.position.top)
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging) return
  
  const deltaX = e.clientX - startX
  const deltaY = e.clientY - startY
  
  const newLeft = startLeft + deltaX
  const newTop = startTop + deltaY
  
  // 更新位置（这里应该通过store更新）
  if (windowRef.value) {
    windowRef.value.style.left = `${newLeft}px`
    windowRef.value.style.top = `${newTop}px`
  }
}

const stopDrag = (e: MouseEvent) => {
  if (!isDragging) return
  
  isDragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  
  // 更新store中的位置
  if (windowRef.value) {
    const newPosition = {
      left: windowRef.value.style.left,
      top: windowRef.value.style.top
    }
    chatStore.updateWindowPosition(props.window.id, newPosition)
  }
}

// 监听消息变化，自动滚动到底部
watch(() => props.window.messages.length, () => {
  nextTick(() => {
    if (contentRef.value) {
      contentRef.value.scrollTop = contentRef.value.scrollHeight
    }
  })
})
</script>

<style scoped lang="scss">
.chat-window {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &.fullscreen {
    border-radius: 0;
  }
  
  &.minimized {
    .chat-content,
    .chat-input,
    .material-viewer {
      display: none;
    }
  }
  
  &.loading {
    pointer-events: none;
    opacity: 0.8;
  }
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  user-select: none;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .window-title {
      font-weight: 600;
      font-size: 14px;
    }
  }
  
  .header-right {
    .el-button-group {
      .el-button {
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        &.el-button--danger {
          background: rgba(245, 108, 108, 0.8);
          
          &:hover {
            background: rgba(245, 108, 108, 1);
          }
        }
      }
    }
  }
}

.chat-content {
  height: 400px;
  overflow-y: auto;
  padding: 16px;
  
  .fullscreen & {
    height: calc(100vh - 200px);
  }
}

.message-item {
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.user-message-content,
.bot-message-content {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.user-message-content {
  justify-content: flex-end;
  flex-direction: row-reverse;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  
  &.user-bubble {
    background: #409EFF;
    color: white;
    border-bottom-right-radius: 6px;
  }
  
  &.bot-bubble {
    background: #f5f7fa;
    color: #333;
    border-bottom-left-radius: 6px;
  }
}

.message-text {
  line-height: 1.5;
  word-wrap: break-word;
}

.message-time {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 4px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
  
  span {
    width: 6px;
    height: 6px;
    background: #999;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  30% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.chat-input {
  border-top: 1px solid #ebeef5;
  padding: 16px;
  
  .input-container {
    display: flex;
    gap: 8px;
    align-items: flex-end;
    
    .upload-button {
      flex-shrink: 0;
    }
    
    .message-input {
      flex: 1;
    }
    
    .send-button {
      flex-shrink: 0;
    }
  }
}

.material-viewer {
  height: 500px;
  
  .fullscreen & {
    height: calc(100vh - 120px);
  }
  
  .material-iframe {
    width: 100%;
    height: 100%;
  }
}

.bot-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
</style>
