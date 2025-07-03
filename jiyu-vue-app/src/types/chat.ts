export interface ChatMessage {
  id: string
  type: 'user' | 'bot' | 'system'
  content: string
  timestamp: number
  avatar?: string
  isTyping?: boolean
  metadata?: {
    knowledge?: string
    problem?: string
    images?: string[]
  }
}

export interface ChatWindow {
  id: string
  type: 'normal' | 'correction' | 'feynman' | 'material' | 'homework'
  title: string
  position: {
    left: string
    top: string
  }
  isFullscreen: boolean
  isMinimized: boolean
  knowledge?: string
  problem?: string
  materialUrl?: string
  messages: ChatMessage[]
  isLoading: boolean
  conversationId: string  // 对话ID
  step?: number          // 对话步骤
  stage?: number         // 费曼学习法阶段
}

export interface SendMessageRequest {
  chatId: string
  type: string
  content: string
  knowledge?: string
  problem?: string
  images?: string[]
}

export interface ChatResponse {
  message: string
  messageId: string
  timestamp: number
}
