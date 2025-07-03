// 聊天相关API - 对接后端Flask服务
import api from './api'

export interface ChatResponse {
  message: string
  botanswer?: string
  step?: number
  stage?: number
  success?: boolean
}

export interface HistoryResponse {
  message: string
  theme?: string[]
  conversationID?: string[]
  history?: any[]
  success?: boolean
}

export const chatAPI = {
  // 普通聊天（智能问答）
  async sendNormalMessage(data: {
    userId: string
    conId: string
    userinfo: string
    step: number
  }): Promise<ChatResponse> {
    try {
      const response = await api.post('/chat/setuserN', {
        userId: data.userId,
        conId: data.conId,
        userinfo: data.userinfo,
        step: data.step
      })
      
      if (response.data.message === "true") {
        return {
          message: response.data.message,
          botanswer: response.data.botanswer,
          step: response.data.step,
          success: true
        }
      } else {
        return {
          message: response.data.message || '发送失败',
          success: false
        }
      }
    } catch (error: any) {
      console.error('Send normal message error:', error)
      return {
        message: error.response?.data?.message || '发送失败',
        success: false
      }
    }
  },

  // 费曼学习法聊天
  async sendFeynmanMessage(data: {
    userId: string
    conId: string
    knowledge: string
    userinfo: string
    stage: number
    step: number
  }): Promise<ChatResponse> {
    try {
      const response = await api.post('/chat/setuserL', {
        userId: data.userId,
        conId: data.conId,
        knowledge: data.knowledge,
        userinfo: data.userinfo,
        stage: data.stage,
        step: data.step
      })
      
      if (response.data.message === "true") {
        return {
          message: response.data.message,
          botanswer: response.data.botanswer,
          step: response.data.step,
          stage: response.data.stage,
          success: true
        }
      } else {
        return {
          message: response.data.message || '发送失败',
          success: false
        }
      }
    } catch (error: any) {
      console.error('Send feynman message error:', error)
      return {
        message: error.response?.data?.message || '发送失败',
        success: false
      }
    }
  },

  // 批改订正聊天
  async sendCorrectionMessage(data: {
    userId: string
    conId: string
    question: string
    userinfo: string
    stage: number
    step: number
    answer: string
  }): Promise<ChatResponse> {
    try {
      const response = await api.post('/chat/setuserC', {
        userId: data.userId,
        conId: data.conId,
        question: data.question,
        userinfo: data.userinfo,
        stage: data.stage,
        step: data.step,
        answer: data.answer
      })
      
      if (response.data.message === "true") {
        return {
          message: response.data.message,
          botanswer: response.data.botanswer,
          step: response.data.step,
          stage: response.data.stage,
          success: true
        }
      } else {
        return {
          message: response.data.message || '发送失败',
          success: false
        }
      }
    } catch (error: any) {
      console.error('Send correction message error:', error)
      return {
        message: error.response?.data?.message || '发送失败',
        success: false
      }
    }
  },

  // OCR识别
  async ocrImage(data: {
    userId: string
    image: string // base64图片数据
  }): Promise<{ output?: string; message: string; success?: boolean }> {
    try {
      const response = await api.post('/chat/ocr', {
        userId: data.userId,
        image: data.image
      })
      
      if (response.data.message === "true") {
        return {
          output: response.data.output,
          message: response.data.message,
          success: true
        }
      } else {
        return {
          message: response.data.message || 'OCR识别失败',
          success: false
        }
      }
    } catch (error: any) {
      console.error('OCR error:', error)
      return {
        message: error.response?.data?.message || 'OCR识别失败',
        success: false
      }
    }
  },

  // 获取普通聊天历史列表
  async getNormalHistoryList(userId: string): Promise<HistoryResponse> {
    try {
      const response = await api.post('/chat/historyListN', {
        userId: userId
      })
      
      if (response.data.message === "true") {
        return {
          message: response.data.message,
          theme: response.data.theme,
          conversationID: response.data.conversationID,
          success: true
        }
      } else {
        return {
          message: response.data.message || '获取历史失败',
          success: false
        }
      }
    } catch (error: any) {
      console.error('Get normal history list error:', error)
      return {
        message: error.response?.data?.message || '获取历史失败',
        success: false
      }
    }
  },

  // 获取费曼学习法历史列表
  async getFeynmanHistoryList(userId: string): Promise<HistoryResponse> {
    try {
      const response = await api.post('/chat/historyListL', {
        userId: userId
      })
      
      if (response.data.message === "true") {
        return {
          message: response.data.message,
          theme: response.data.theme,
          conversationID: response.data.conversationID,
          success: true
        }
      } else {
        return {
          message: response.data.message || '获取历史失败',
          success: false
        }
      }
    } catch (error: any) {
      console.error('Get feynman history list error:', error)
      return {
        message: error.response?.data?.message || '获取历史失败',
        success: false
      }
    }
  },

  // 获取批改订正历史列表
  async getCorrectionHistoryList(userId: string): Promise<HistoryResponse> {
    try {
      const response = await api.post('/chat/historyListC', {
        userId: userId
      })
      
      if (response.data.message === "true") {
        return {
          message: response.data.message,
          theme: response.data.theme,
          conversationID: response.data.conversationID,
          success: true
        }
      } else {
        return {
          message: response.data.message || '获取历史失败',
          success: false
        }
      }
    } catch (error: any) {
      console.error('Get correction history list error:', error)
      return {
        message: error.response?.data?.message || '获取历史失败',
        success: false
      }
    }
  },

  // 获取聊天历史详情
  async getChatHistory(data: {
    userId: string
    conId: string
  }): Promise<HistoryResponse> {
    try {
      const response = await api.post('/chat/historyN', {
        userId: data.userId,
        conId: data.conId
      })
      
      if (response.data.message === "true") {
        return {
          message: response.data.message,
          history: response.data.history,
          success: true
        }
      } else {
        return {
          message: response.data.message || '获取历史失败',
          success: false
        }
      }
    } catch (error: any) {
      console.error('Get chat history error:', error)
      return {
        message: error.response?.data?.message || '获取历史失败',
        success: false
      }
    }
  }
}
