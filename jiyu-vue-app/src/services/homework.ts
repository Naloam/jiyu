import api from './api'
import type { Question, UserAnswer, DailyHomework, HomeworkStats } from '@/types/homework'

export const homeworkAPI = {
  // 获取今日作业
  async getTodayHomework(date: string): Promise<DailyHomework | null> {
    try {
      const response = await api.get(`/homework/daily/${date}`)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  // 生成新作业
  async generateHomework(): Promise<DailyHomework> {
    const response = await api.post('/homework/generate')
    return response.data
  },

  // 提交作业
  async submitHomework(data: { 
    homeworkId: string, 
    answers: UserAnswer[] 
  }): Promise<{ score: number, accuracy: number, feedback: string }> {
    const response = await api.post('/homework/submit', data)
    return response.data
  },

  // 获取统计数据
  async getStats(): Promise<HomeworkStats> {
    const response = await api.get('/homework/stats')
    return response.data
  },

  // 获取历史记录
  async getHistory(page: number = 1, limit: number = 10): Promise<{
    homeworks: DailyHomework[]
    total: number
    hasMore: boolean
  }> {
    const response = await api.get('/homework/history', {
      params: { page, limit }
    })
    return response.data
  },

  // 获取错题集
  async getWrongQuestions(): Promise<Question[]> {
    const response = await api.get('/homework/wrong-questions')
    return response.data
  },

  // 获取题目详情
  async getQuestionDetail(questionId: string): Promise<Question> {
    const response = await api.get(`/questions/${questionId}`)
    return response.data
  },

  // 收藏题目
  async favoriteQuestion(questionId: string): Promise<void> {
    await api.post(`/questions/${questionId}/favorite`)
  },

  // 取消收藏
  async unfavoriteQuestion(questionId: string): Promise<void> {
    await api.delete(`/questions/${questionId}/favorite`)
  }
}
