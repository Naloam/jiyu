import { defineStore } from 'pinia'
import { chatAPI } from '@/services/chat-new'
import type { ChatWindow, ChatMessage, SendMessageRequest } from '@/types/chat'
import { generateId } from '@/utils/helpers'
import { useAuthStore } from './auth'

interface ChatState {
  windows: ChatWindow[]
  maxWindows: number
  currentWindowId: string | null
  isGlobalLoading: boolean
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    windows: [],
    maxWindows: 2,
    currentWindowId: null,
    isGlobalLoading: false
  }),
  
  getters: {
    getWindowById: (state) => (id: string) => {
      return state.windows.find(window => window.id === id)
    },
    
    canCreateWindow: (state) => {
      return state.windows.length < state.maxWindows
    },
    
    hasTypingBot: (state) => {
      return state.windows.some(window => 
        window.messages.some(msg => msg.isTyping)
      )
    }
  },
  
  actions: {
    createWindow(config: {
      type: ChatWindow['type']
      title: string
      knowledge?: string
      problem?: string
      materialUrl?: string
    }) {
      if (!this.canCreateWindow) {
        throw new Error('窗口已满，请关闭一个窗口后重试')
      }
      
      const windowId = generateId()
      const position = this.calculatePosition()
      
      const newWindow: ChatWindow = {
        id: windowId,
        type: config.type,
        title: config.title,
        position,
        isFullscreen: false,
        isMinimized: false,
        knowledge: config.knowledge,
        problem: config.problem,
        materialUrl: config.materialUrl,
        messages: [],
        isLoading: false,
        conversationId: generateId(), // 生成对话ID
        step: 0,                     // 初始化步骤
        stage: 1                     // 初始化阶段
      }
      
      // 添加欢迎消息
      if (config.type !== 'material') {
        newWindow.messages.push({
          id: generateId(),
          type: 'bot',
          content: this.getWelcomeMessage(config.type),
          timestamp: Date.now()
        })
      }
      
      this.windows.push(newWindow)
      this.currentWindowId = windowId
      
      return windowId
    },
    
    closeWindow(windowId: string) {
      const index = this.windows.findIndex(w => w.id === windowId)
      if (index > -1) {
        this.windows.splice(index, 1)
        this.rearrangeWindows()
        
        // 如果关闭的是当前窗口，切换到其他窗口
        if (this.currentWindowId === windowId) {
          this.currentWindowId = this.windows.length > 0 ? this.windows[0].id : null
        }
      }
    },
    
    async sendMessage(request: SendMessageRequest) {
      const window = this.getWindowById(request.chatId)
      if (!window) return
      
      // 添加用户消息
      const userMessage: ChatMessage = {
        id: generateId(),
        type: 'user',
        content: request.content,
        timestamp: Date.now(),
        metadata: {
          knowledge: request.knowledge,
          problem: request.problem,
          images: request.images
        }
      }
      
      window.messages.push(userMessage)
      
      // 添加正在输入的bot消息
      const botMessageId = generateId()
      const botMessage: ChatMessage = {
        id: botMessageId,
        type: 'bot',
        content: '',
        timestamp: Date.now(),
        isTyping: true
      }
      
      window.messages.push(botMessage)
      window.isLoading = true
      
      try {
        const authStore = useAuthStore()
        const token = authStore.token || localStorage.getItem('jiyu_token')
        
        if (!token) {
          throw new Error('用户未登录')
        }
        
        let response
        
        // 根据窗口类型调用不同的API
        switch (window.type) {
          case 'normal':
            response = await chatAPI.sendNormalMessage({
              userId: token,
              conId: window.conversationId,
              userinfo: request.content,
              step: window.step || 0
            })
            break
            
          case 'feynman':
            response = await chatAPI.sendFeynmanMessage({
              userId: token,
              conId: window.conversationId,
              knowledge: request.knowledge || window.knowledge || '',
              userinfo: request.content,
              stage: window.stage || 1,
              step: window.step || 0
            })
            break
            
          case 'correction':
            response = await chatAPI.sendCorrectionMessage({
              userId: token,
              conId: window.conversationId,
              question: request.problem || '批改订正',
              userinfo: request.content,
              stage: window.stage || 1,
              step: window.step || 0,
              answer: request.content
            })
            break
            
          default:
            throw new Error('未知的聊天类型')
        }
        
        // 更新bot消息
        const messageIndex = window.messages.findIndex(msg => msg.id === botMessageId)
        if (messageIndex > -1 && response.success) {
          window.messages[messageIndex] = {
            ...botMessage,
            content: response.botanswer || response.message,
            isTyping: false
          }
          
          // 更新窗口状态
          if (response.step !== undefined) {
            window.step = response.step
          }
          if (response.stage !== undefined) {
            window.stage = response.stage
          }
        }
      } catch (error) {
        // 处理错误
        const messageIndex = window.messages.findIndex(msg => msg.id === botMessageId)
        if (messageIndex > -1) {
          window.messages[messageIndex] = {
            ...botMessage,
            content: '抱歉，发生了错误，请稍后重试',
            isTyping: false
          }
        }
      } finally {
        window.isLoading = false
      }
    },
    
    toggleWindowFullscreen(windowId: string) {
      const window = this.getWindowById(windowId)
      if (window) {
        window.isFullscreen = !window.isFullscreen
      }
    },
    
    minimizeWindow(windowId: string) {
      const window = this.getWindowById(windowId)
      if (window) {
        window.isMinimized = true
      }
    },
    
    restoreWindow(windowId: string) {
      const window = this.getWindowById(windowId)
      if (window) {
        window.isMinimized = false
      }
    },
    
    calculatePosition() {
      const baseLeft = 20
      const baseTop = 100
      const offset = this.windows.length * 30
      
      return {
        left: `${baseLeft + offset}px`,
        top: `${baseTop + offset}px`
      }
    },
    
    updateWindowPosition(windowId: string, position: { left: string, top: string }) {
      const window = this.getWindowById(windowId)
      if (window) {
        window.position = position
      }
    },
    
    rearrangeWindows() {
      this.windows.forEach((window, index) => {
        window.position = {
          left: `${20 + index * 30}px`,
          top: `${100 + index * 30}px`
        }
      })
    },
    
    getWelcomeMessage(type: ChatWindow['type']) {
      const messages: Record<ChatWindow['type'], string> = {
        normal: '您好！我是您的AI学习助手，有什么可以帮助您的吗？',
        correction: '请上传您需要批改的作业，我会为您详细分析并提供改进建议。',
        feynman: '欢迎使用费曼学习法！请告诉我您想要学习的知识点，我会引导您用自己的话来解释它。',
        homework: '准备好开始今天的练习了吗？让我们一起提升您的学习水平！',
        material: '正在加载学习资料...'
      }
      
      return messages[type]
    },
    
    clearAllWindows() {
      this.windows = []
      this.currentWindowId = null
    }
  }
})
