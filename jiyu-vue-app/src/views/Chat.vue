<template>
  <ScrollContainer class="chat-page" height="100vh">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <img src="@/assets/logo.svg" alt="Logo" class="toolbar-logo">
      <div class="buttons">
        <el-button text @click="navigateTo('/dashboard')" :class="{ active: $route.path === '/dashboard' }">主界面</el-button>
        <el-button text @click="navigateTo('/daily-practice')" :class="{ active: $route.path === '/daily-practice' }">每日刷题</el-button>
        <el-button text :class="{ active: $route.path === '/chat' }">智能问答</el-button>
        <el-button text @click="navigateTo('/planning')" :class="{ active: $route.path === '/planning' }">事项规划</el-button>
        <el-button text @click="navigateTo('/materials')" :class="{ active: $route.path === '/materials' }">学习资料</el-button>
        <el-button text @click="navigateTo('/correction')" :class="{ active: $route.path === '/correction' }">批改订正</el-button>
        <el-button text @click="showExpPointsDialog = true">经验值与奖励</el-button>
        
        <!-- 个性化学习下拉菜单 -->
        <div class="dropdown-container" @mouseover="showPersonalizedMenu = true" @mouseleave="showPersonalizedMenu = false">
          <el-button text>个性化学习</el-button>
          <div class="dropdown-menu" v-show="showPersonalizedMenu">
            <div class="dropdown-buttons">
              <el-button class="learn-btn" @click="createFeynmanChatWindow">
                费曼学习法
                <span class="description">用自己的语言解释所学知识来加深理解和记忆</span>
              </el-button>
              <el-button class="learn-btn" @click="showFeatureComingSoon">
                智能规划
                <span class="description">让AI来帮您定制学习路线吧！</span>
              </el-button>
              <el-button class="learn-btn" @click="showFeatureComingSoon">
                敬请期待
                <span class="description">敬请期待多种学习方法</span>
              </el-button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="settings">
        <span class="username-display">{{ username }}</span>
        <el-button :icon="Setting" circle @click="toggleSidebar" />
      </div>
    </div>
    
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ open: sidebarOpen }">
      <h2>设置</h2>
      <el-button text @click="showGuide">使用指南</el-button>
      <el-button text @click="showChangePasswordDialog = true">修改密码</el-button>
      <el-button type="danger" @click="logout">退出登录</el-button>
    </div>
    
    <!-- 聊天窗口容器 -->
    <div class="chat-windows-container">
      <template v-for="(chat, index) in chatWindows" :key="chat.id">
        <div class="chat-container" :style="getChatStyle(chat, index)">
          <!-- 聊天窗口标题栏 -->
          <div 
            class="chat-header" 
            @mousedown="startDrag($event, chat.id)"
            style="cursor: move;"
          >
            <div class="chat-title">{{ chat.title }}</div>
            <div class="chat-controls">
              <el-button :icon="Minus" circle text @click="minimizeChat(chat.id)" />
              <el-button :icon="Close" circle text @click="closeChat(chat.id)" />
            </div>
          </div>
          
          <!-- 聊天消息区域 -->
          <div class="chat-messages" ref="chatMessagesRef">
            <div 
              v-for="(msg, msgIndex) in chat.messages" 
              :key="msgIndex" 
              :class="['message', msg.sender === 'user' ? 'user-message' : 'bot-message']"
            >
              <div class="message-content" v-html="renderMessage(msg.content)"></div>
              <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
            </div>
            
            <div v-if="chat.isTyping" class="bot-typing">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          
          <!-- 聊天输入区域 -->
          <div class="chat-input-area">
            <el-input
              v-model="chat.inputText"
              type="textarea"
              :rows="2"
              placeholder="在这里输入问题..."
              resize="none"
              @keyup.enter.exact="sendUserMessage(chat.id, $event)"
            />
            <div class="input-buttons">
              <el-button :icon="Picture" circle @click="openImageUpload(chat.id)" />
              <el-button type="primary" @click="sendUserMessage(chat.id)">发送</el-button>
              <input 
                type="file" 
                ref="fileInput" 
                style="display: none" 
                accept="image/*"
                @change="handleImageUpload"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
    
    <!-- 宠物动画 -->
    <div id="parentDiv">
      <div class="img" ref="petRef"></div>
    </div>
    
    <!-- 欢迎模态框 -->
    <el-dialog
      v-model="showWelcomeDialog"
      title="欢迎使用积语伴学"
      width="30%"
      :show-close="true"
      :close-on-click-modal="true"
    >
      <p>{{ welcomeMessage }}</p>
      <p><span>如初次使用，可以先在设置查看软件使用指南并更新账号信息</span></p>
    </el-dialog>
    
    <!-- 功能即将推出提示框 -->
    <el-dialog
      v-model="showComingSoonDialog"
      title="功能开发中"
      width="30%"
    >
      <p>更多学习方法敬请期待!</p>
    </el-dialog>
    
    <!-- 经验值与奖励对话框 -->
    <el-dialog
      v-model="showExpPointsDialog"
      title="经验值与奖励"
      width="40%"
    >
      <div class="exp-points-container">
        <div class="user-level">
          <h3>当前等级: {{ userLevel }}</h3>
          <el-progress :percentage="expPercentage" :format="formatExpProgress" />
          <p>距离下一等级还需 {{ nextLevelExp - currentExp }} 经验值</p>
        </div>
        
        <div class="rewards">
          <h3>我的奖励</h3>
          <div class="rewards-list">
            <el-empty v-if="rewards.length === 0" description="暂无奖励" />
            <el-card v-for="(reward, index) in rewards" :key="index" class="reward-item">
              <template #header>
                <div class="reward-header">
                  <span>{{ reward.name }}</span>
                  <el-tag size="small" :type="reward.used ? 'info' : 'success'">
                    {{ reward.used ? '已使用' : '可使用' }}
                  </el-tag>
                </div>
              </template>
              <div class="reward-content">
                <p>{{ reward.description }}</p>
                <p class="reward-date">获得时间: {{ formatDate(reward.date) }}</p>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </el-dialog>
    
    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="showChangePasswordDialog"
      title="修改密码"
      width="30%"
    >
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showChangePasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确认</el-button>
      </template>
    </el-dialog>
    
    <!-- 使用指南对话框 -->
    <el-dialog
      v-model="showGuideDialog"
      title="使用指南"
      width="60%"
      fullscreen
    >
      <div class="guide-content">
        <h2>欢迎使用积语伴学</h2>
        <p>本软件是为学生打造的智能学习助手，通过以下功能助力您的学习：</p>
        
        <h3>1. 智能问答</h3>
        <p>您可以向AI助手提问任何学习相关的问题，包括但不限于课程知识、解题方法、学习技巧等。</p>
        <p>支持上传图片进行识别和分析，如拍摄课本或作业中的问题。</p>
        
        <h3>2. 每日刷题</h3>
        <p>系统提供各难度等级的练习题，帮助您巩固所学知识。</p>
        <p>完成题目后可获得经验值和积分奖励。</p>
        
        <h3>3. 批改订正</h3>
        <p>上传您的作业或练习题答案，AI将帮您批改并给出改进建议。</p>
        
        <h3>4. 个性化学习</h3>
        <p>提供费曼学习法等多种学习方法，帮助您更有效地掌握知识。</p>
        
        <h3>5. 事项规划</h3>
        <p>帮助您管理学习任务，提高学习效率。</p>
        
        <h3>6. 学习资料</h3>
        <p>提供丰富的学习资源，包括教材解析、知识点总结、解题技巧等。</p>
      </div>
    </el-dialog>
  </ScrollContainer>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ScrollContainer from '@/components/common/ScrollContainer.vue'
import { Setting, Close, Minus, Picture } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import type { FormInstance, FormRules } from 'element-plus'

// 声明markdown-it模块
declare module 'markdown-it'
import MarkdownIt from 'markdown-it'

// 初始化markdown解析器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// 路由和状态
const router = useRouter()
const authStore = useAuthStore()
const username = computed(() => authStore.username || '用户')

// 侧边栏状态
const sidebarOpen = ref(false)
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// 聊天窗口相关
const maxChatWindows = 2 // 最大聊天窗口数量
const chatWindows = ref<Array<{
  id: string;
  title: string;
  type: string;
  messages: Array<{
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }>;
  inputText: string;
  isMinimized: boolean;
  isTyping: boolean;
  position: {
    left: string;
    top: string;
  };
}>>([])

// 文件上传相关
const fileInput = ref<HTMLInputElement | null>(null)
const currentChatId = ref('')

// 对话框状态
const showWelcomeDialog = ref(false)
const showComingSoonDialog = ref(false)
const showExpPointsDialog = ref(false)
const showChangePasswordDialog = ref(false)
const showGuideDialog = ref(false)
const showPersonalizedMenu = ref(false)

// 欢迎消息
const welcomeMessage = computed(() => {
  const timeNow = new Date().getHours()
  let greeting = ''
  
  if (timeNow >= 5 && timeNow < 12) {
    greeting = '早上好'
  } else if (timeNow >= 12 && timeNow < 18) {
    greeting = '下午好'
  } else {
    greeting = '晚上好'
  }
  
  return `${greeting}，${username.value}！欢迎回到积语伴学。`
})

// 用户经验相关
const userLevel = computed(() => authStore.userLevel || 1)
const currentExp = computed(() => authStore.experience || 0)
const nextLevelExp = computed(() => userLevel.value * 100)
const expPercentage = computed(() => {
  const levelExp = userLevel.value * 100
  const prevLevelExp = (userLevel.value - 1) * 100
  const currentLevelExp = currentExp.value - prevLevelExp
  const requiredExp = levelExp - prevLevelExp
  return Math.floor((currentLevelExp / requiredExp) * 100)
})

// 奖励数据
const rewards = ref<Array<{
  name: string;
  description: string;
  date: Date;
  used: boolean;
}>>([
  // 示例奖励数据
  // { name: '勤奋学习奖', description: '连续学习7天', date: new Date(), used: false }
])

// 修改密码表单
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码表单验证规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 宠物引用
const petRef = ref<HTMLElement | null>(null)

// 消息区域引用
const chatMessagesRef = ref<HTMLElement[]>([])

// 获取聊天窗口样式
const getChatStyle = (chat: any, index: number) => {
  if (chat.isMinimized) {
    return {
      position: 'fixed' as const,
      bottom: '20px',
      right: `${20 + index * 220}px`,
      width: '200px',
      height: '40px',
      zIndex: 1000
    }
  }
  
  return {
    position: 'fixed' as const,
    left: chat.position.left,
    top: chat.position.top,
    width: '500px',
    height: '600px',
    zIndex: 999
  }
}

// 路由导航
const navigateTo = (path: string) => {
  router.push(path)
}

// 显示功能即将推出提示
const showFeatureComingSoon = () => {
  showComingSoonDialog.value = true
}

// 创建聊天窗口
const createChatWindow = (type: string, title: string) => {
  if (chatWindows.value.length >= maxChatWindows) {
    ElMessage.warning('窗口已满，请先关闭一个聊天窗口')
    return
  }
  
  const id = Date.now().toString()
  
  // 计算新窗口位置
  const baseLeft = 20
  const baseTop = 100
  const offset = chatWindows.value.length * 30
  
  chatWindows.value.push({
    id,
    title,
    type,
    messages: [],
    inputText: '',
    isMinimized: false,
    isTyping: false,
    position: {
      left: `${baseLeft + offset}px`,
      top: `${baseTop + offset}px`
    }
  })
  
  // 如果是费曼学习法，自动发送引导消息
  if (type === 'feynman') {
    setTimeout(() => {
      addBotMessage(id, '欢迎使用费曼学习法！请选择一个您想要学习的知识点，用自己的语言解释它，就像您在教导别人一样。这将帮助您发现知识的盲点和加深理解。')
    }, 500)
  }
}

// 创建费曼学习法聊天窗口
const createFeynmanChatWindow = () => {
  createChatWindow('feynman', '费曼学习法')
}

// 关闭聊天窗口
const closeChat = (id: string) => {
  const index = chatWindows.value.findIndex(chat => chat.id === id)
  if (index !== -1) {
    chatWindows.value.splice(index, 1)
  }
}

// 最小化聊天窗口
const minimizeChat = (id: string) => {
  const chat = chatWindows.value.find(chat => chat.id === id)
  if (chat) {
    chat.isMinimized = !chat.isMinimized
  }
}

// 拖拽功能
let isDragging = false
let dragChatId = ''
let startX = 0
let startY = 0
let startLeft = 0
let startTop = 0

const startDrag = (e: MouseEvent, chatId: string) => {
  isDragging = true
  dragChatId = chatId
  startX = e.clientX
  startY = e.clientY
  
  const chat = chatWindows.value.find(c => c.id === chatId)
  if (chat) {
    startLeft = parseInt(chat.position.left) || 0
    startTop = parseInt(chat.position.top) || 0
  }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging || !dragChatId) return
  
  const deltaX = e.clientX - startX
  const deltaY = e.clientY - startY
  
  const newLeft = startLeft + deltaX
  const newTop = startTop + deltaY
  
  const chat = chatWindows.value.find(c => c.id === dragChatId)
  if (chat) {
    chat.position = {
      left: `${newLeft}px`,
      top: `${newTop}px`
    }
  }
}

const stopDrag = () => {
  isDragging = false
  dragChatId = ''
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 发送用户消息
const sendUserMessage = async (chatId: string, event?: KeyboardEvent) => {
  if (event) {
    // 如果是按Enter键，并且没有同时按下Shift键，则阻止默认行为
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
    } else {
      return // 如果是Shift+Enter或其他键，不处理
    }
  }
  
  const chat = chatWindows.value.find(c => c.id === chatId)
  if (!chat || !chat.inputText.trim()) return
  
  const userMessage = chat.inputText.trim()
  chat.messages.push({
    content: userMessage,
    sender: 'user',
    timestamp: new Date()
  })
  chat.inputText = ''
  chat.isTyping = true
  
  // 滚动到底部
  await nextTick()
  scrollToBottom(chatId)
  
  // 模拟AI回复
  setTimeout(() => {
    let botResponse = ''
    
    if (chat.type === 'feynman') {
      botResponse = generateFeynmanResponse(userMessage)
    } else {
      botResponse = generateBotResponse(userMessage)
    }
    
    addBotMessage(chatId, botResponse)
    chat.isTyping = false
  }, 1500)
}

// 添加机器人消息
const addBotMessage = (chatId: string, content: string) => {
  const chat = chatWindows.value.find(c => c.id === chatId)
  if (!chat) return
  
  chat.messages.push({
    content,
    sender: 'bot',
    timestamp: new Date()
  })
  
  // 滚动到底部
  nextTick(() => {
    scrollToBottom(chatId)
  })
}

// 滚动消息区域到底部
const scrollToBottom = (chatId: string) => {
  const index = chatWindows.value.findIndex(c => c.id === chatId)
  if (index !== -1 && chatMessagesRef.value && chatMessagesRef.value[index]) {
    const messagesContainer = chatMessagesRef.value[index]
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }
}

// 渲染消息内容
const renderMessage = (content: string) => {
  return md.render(content)
}

// 格式化时间
const formatTime = (date: Date) => {
  return dayjs(date).format('HH:mm')
}

// 格式化日期
const formatDate = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

// 格式化经验值进度
const formatExpProgress = (percentage: number) => {
  return `${currentExp.value}/${nextLevelExp.value}`
}

// 打开图片上传
const openImageUpload = (chatId: string) => {
  currentChatId.value = chatId
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 处理图片上传
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  
  const file = target.files[0]
  const reader = new FileReader()
  
  reader.onload = (e) => {
    const imageData = e.target?.result as string
    if (imageData) {
      const chat = chatWindows.value.find(c => c.id === currentChatId.value)
      if (chat) {
        // 添加图片消息
        chat.messages.push({
          content: `![上传的图片](${imageData})`,
          sender: 'user',
          timestamp: new Date()
        })
        
        chat.isTyping = true
        
        // 滚动到底部
        nextTick(() => {
          scrollToBottom(currentChatId.value)
        })
        
        // 模拟处理图片
        setTimeout(() => {
          const botResponse = "我已收到您上传的图片，请问有什么可以帮助您的？"
          addBotMessage(currentChatId.value, botResponse)
          chat.isTyping = false
        }, 2000)
      }
    }
    
    // 清空文件输入
    if (target) {
      target.value = ''
    }
  }
  
  reader.readAsDataURL(file)
}

// 生成机器人回复
const generateBotResponse = (userMessage: string) => {
  // 这里简单实现，后期可对接后端API
  const responses = [
    "我理解您的问题，这个知识点涉及到...",
    "根据我的理解，您问的是关于...",
    "这个问题的答案是...",
    "我可以从以下几个方面为您解答...",
    "这是一个很好的问题！让我为您详细解答..."
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

// 生成费曼学习法回复
const generateFeynmanResponse = (userMessage: string) => {
  // 费曼学习法的回复逻辑
  const responses = [
    "您的解释很好，但可以尝试用更简单的语言表达，就像您在向小学生解释一样。",
    "很棒的尝试！您是否能找出解释中的盲点或不确定的部分？这些往往是需要重新学习的地方。",
    "您的解释清晰明了。接下来，您可以尝试找一个实际例子来加深理解。",
    "您已经掌握了这个概念的核心，现在尝试用不同的角度来解释它，这会帮助您拓展思路。",
    "您的解释中还有一些专业术语，尝试用更日常的语言来表达同样的概念。"
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

// 修改密码
const changePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    const valid = await passwordFormRef.value.validate()
    if (!valid) return
    
    ElMessage.success('密码修改成功！')
    showChangePasswordDialog.value = false
    
    // 重置表单
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    console.error('Form validation error:', error)
  }
}

// 展示使用指南
const showGuide = () => {
  showGuideDialog.value = true
}

// 退出登录
const logout = () => {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    authStore.logout()
    router.push('/login')
    ElMessage.success('已成功退出登录')
  }).catch(() => {})
}

// 初始化桌面宠物动画
const initDeskPet = () => {
  if (!petRef.value) return
  
  const petElement = petRef.value
  let moveRange = 10
  
  function getRandomNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  
  function movePet() {
    const x = getRandomNum(-moveRange, moveRange)
    const y = getRandomNum(-moveRange, moveRange)
    
    const currentLeft = parseInt(getComputedStyle(petElement).left) || 0
    const currentBottom = parseInt(getComputedStyle(petElement).bottom) || 0
    
    const newLeft = currentLeft + x
    const newBottom = currentBottom + y
    
    // 确保宠物不会移出屏幕
    petElement.style.left = `${Math.max(10, Math.min(window.innerWidth - 100, newLeft))}px`
    petElement.style.bottom = `${Math.max(10, Math.min(window.innerHeight - 100, newBottom))}px`
    
    setTimeout(movePet, getRandomNum(1000, 3000))
  }
  
  petElement.style.position = 'fixed'
  petElement.style.bottom = '20px'
  petElement.style.left = '20px'
  petElement.style.width = '64px'
  petElement.style.height = '64px'
  petElement.style.backgroundImage = 'url("/lilpet.gif")'
  petElement.style.backgroundSize = 'cover'
  petElement.style.zIndex = '1000'
  
  // 开始移动
  setTimeout(movePet, 1000)
}

// 组件挂载
onMounted(() => {
  // 显示欢迎消息
  showWelcomeDialog.value = true
  
  // 自动创建第一个聊天窗口
  createChatWindow('normal', '智能问答')
  
  // 初始化桌面宠物
  initDeskPet()
})

// 监听聊天窗口数量，调整位置
watch(() => chatWindows.value.length, () => {
  nextTick(() => {
    // 窗口数量变化时的处理逻辑已移动到getChatStyle函数中
  })
})
</script>

<style scoped lang="scss">
.chat-page {
  position: relative;
  width: 100%;
  background-image: url('@/assets/bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

// 工具栏样式
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-bottom: 2px solid #ddd;
  padding: 10px;
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 50px;
  z-index: 1200;
  margin-bottom: 10px;
  
  .toolbar-logo {
    width: 8vw;
    height: 3vw;
    object-fit: contain;
    margin-left: 10%;
  }
  
  .buttons {
    flex-grow: 1;
    display: flex;
    justify-content: flex-start;
    
    :deep(.el-button) {
      background: none;
      border: none;
      color: #333;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      padding: 10px 15px;
      position: relative;
      transition: color 0.3s;
      
      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 0;
        height: 2px;
        background-color: #007bff;
        transition: width 0.3s ease-in-out;
      }
      
      &:hover, &.active {
        color: #007bff;
        
        &::after {
          width: 100%;
        }
      }
    }
  }
  
  .settings {
    position: absolute;
    right: 10%;
    text-align: right;
    z-index: 1001;
    
    .username-display {
      margin-right: 15px;
      font-weight: bold;
      font-size: 18px;
      color: #1a17db;
      margin-top: -10px;
      display: inline-block;
      vertical-align: middle;
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
    left: 10vw;
    width: 80vw;
    background-color: white;
    border-bottom: 2px solid #ddd;
    border-top: none;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1199;
    padding: 1px;
    
    .dropdown-buttons {
      display: flex;
      justify-content: center;
      gap: 40px;
      
      .learn-btn {
        background: none;
        border: 1px solid #ddd;
        padding: 10px 20px;
        font-size: 10px;
        color: black;
        text-align: center;
        cursor: pointer;
        position: relative;
        transition: box-shadow 0.3s ease-in-out;
        
        .description {
          display: block;
          font-size: 10px;
          color: gray;
          margin-top: 5px;
        }
        
        &:hover {
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
      }
    }
  }
}

// 侧边栏样式
.sidebar {
  height: 100%;
  width: 200px;
  position: fixed;
  top: 0;
  left: -200px;
  background-color: #f0f0f0;
  overflow-x: hidden;
  padding-top: 60px;
  transition: 0.5s;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  h2 {
    color: #333;
    text-align: center;
    margin-bottom: 20px;
  }
  
  :deep(.el-button) {
    width: 80%;
    margin: 5px 0;
    text-align: left;
  }
  
  &.open {
    left: 0;
  }
}

// 聊天窗口容器
.chat-windows-container {
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 60px;
}

// 聊天窗口样式
.chat-container {
  position: absolute;
  width: 40%;
  height: 70%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  top: 80px;
  transition: left 0.3s ease;
  
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
    
    .chat-title {
      font-weight: bold;
      font-size: 16px;
      color: #333;
    }
    
    .chat-controls {
      display: flex;
      gap: 5px;
    }
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    background-color: #f9f9f9;
    
    .message {
      max-width: 80%;
      margin-bottom: 15px;
      padding: 10px 15px;
      border-radius: 15px;
      position: relative;
      
      .message-content {
        word-break: break-word;
        
        :deep(p) {
          margin: 0 0 8px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
        
        :deep(img) {
          max-width: 100%;
          border-radius: 5px;
        }
        
        :deep(pre) {
          background-color: #f1f1f1;
          padding: 10px;
          border-radius: 5px;
          overflow-x: auto;
        }
      }
      
      .message-time {
        font-size: 12px;
        color: #999;
        margin-top: 5px;
        text-align: right;
      }
    }
    
    .user-message {
      background-color: #e3f2fd;
      margin-left: auto;
      border-bottom-right-radius: 5px;
    }
    
    .bot-message {
      background-color: #fff;
      border-bottom-left-radius: 5px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .bot-typing {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      
      .typing-indicator {
        background-color: #f0f0f0;
        padding: 8px 15px;
        border-radius: 15px;
        display: inline-flex;
        align-items: center;
        
        span {
          height: 8px;
          width: 8px;
          background-color: #999;
          border-radius: 50%;
          display: inline-block;
          margin: 0 2px;
          animation: typing 1.4s infinite;
          
          &:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          &:nth-child(3) {
            animation-delay: 0.4s;
          }
        }
      }
    }
  }
  
  .chat-input-area {
    padding: 10px 15px;
    background-color: #fff;
    border-top: 1px solid #eee;
    
    .input-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
  }
}

// 奖励相关样式
.exp-points-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  .user-level {
    text-align: center;
    padding: 20px;
    border-radius: 8px;
    background-color: #f5f7fa;
    
    h3 {
      margin-bottom: 15px;
      color: #409EFF;
    }
  }
  
  .rewards {
    h3 {
      margin-bottom: 15px;
      text-align: center;
    }
    
    .rewards-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
      
      .reward-item {
        .reward-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .reward-content {
          .reward-date {
            font-size: 12px;
            color: #999;
            margin-top: 10px;
          }
        }
      }
    }
  }
}

// 使用指南样式
.guide-content {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #409EFF;
  }
  
  h3 {
    margin-top: 25px;
    color: #409EFF;
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 15px;
  }
}

// 动画
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>
