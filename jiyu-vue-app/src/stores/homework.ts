import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { homeworkAPI } from '@/services/homework'
import type { Question, UserAnswer, DailyHomework, HomeworkStats } from '@/types/homework'

interface HomeworkState {
  currentHomework: DailyHomework | null
  questions: Question[]
  currentQuestionIndex: number
  userAnswers: Map<string, UserAnswer>
  stats: HomeworkStats | null
  isLoading: boolean
  timeStarted: number | null
}

export const useHomeworkStore = defineStore('homework', {
  state: (): HomeworkState => ({
    currentHomework: null,
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: new Map(),
    stats: null,
    isLoading: false,
    timeStarted: null
  }),
  
  getters: {
    currentQuestion: (state) => {
      return state.questions[state.currentQuestionIndex] || null
    },
    
    progress: (state) => {
      if (!state.questions.length) return 0
      return Math.round((state.currentQuestionIndex / state.questions.length) * 100)
    },
    
    completedCount: (state) => {
      return state.userAnswers.size
    },
    
    correctCount: (state) => {
      return Array.from(state.userAnswers.values()).filter(answer => answer.isCorrect).length
    },
    
    accuracy: (state) => {
      const total = state.userAnswers.size
      if (total === 0) return 0
      const correct = Array.from(state.userAnswers.values()).filter(answer => answer.isCorrect).length
      return Math.round((correct / total) * 100)
    },
    
    canGoNext: (state) => {
      return state.currentQuestionIndex < state.questions.length - 1
    },
    
    canGoPrevious: (state) => {
      return state.currentQuestionIndex > 0
    },
    
    isCompleted: (state) => {
      return state.userAnswers.size === state.questions.length && state.questions.length > 0
    }
  },
  
  actions: {
    async loadTodayHomework() {
      this.isLoading = true
      try {
        const today = new Date().toISOString().split('T')[0]
        const homework = await homeworkAPI.getTodayHomework(today)
        
        if (homework) {
          this.currentHomework = homework
          this.questions = homework.questions
          this.currentQuestionIndex = 0
          this.userAnswers.clear()
        } else {
          // 如果今天没有作业，生成新的
          await this.generateNewHomework()
        }
      } catch (error) {
        console.error('Failed to load homework:', error)
        ElMessage.error('加载今日作业失败')
      } finally {
        this.isLoading = false
      }
    },
    
    async generateNewHomework() {
      try {
        const homework = await homeworkAPI.generateHomework()
        this.currentHomework = homework
        this.questions = homework.questions
        this.currentQuestionIndex = 0
        this.userAnswers.clear()
      } catch (error) {
        console.error('Failed to generate homework:', error)
        ElMessage.error('生成作业失败')
      }
    },
    
    startHomework() {
      this.timeStarted = Date.now()
    },
    
    submitAnswer(answer: string | string[]) {
      if (!this.currentQuestion || !this.timeStarted) return
      
      const timeSpent = Date.now() - this.timeStarted
      const isCorrect = this.checkAnswer(this.currentQuestion, answer)
      
      const userAnswer: UserAnswer = {
        questionId: this.currentQuestion.id,
        answer,
        isCorrect,
        submitTime: new Date().toISOString(),
        timeSpent
      }
      
      this.userAnswers.set(this.currentQuestion.id, userAnswer)
      
      // 重置计时
      this.timeStarted = Date.now()
      
      return { isCorrect, explanation: this.currentQuestion.explanation }
    },
    
    checkAnswer(question: Question, userAnswer: string | string[]): boolean {
      const correctAnswer = question.correctAnswer
      
      if (question.type === 'multiple') {
        // 多选题：需要完全匹配
        if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
          const userSet = new Set(userAnswer.sort())
          const correctSet = new Set(correctAnswer.sort())
          return userSet.size === correctSet.size && 
                 [...userSet].every(item => correctSet.has(item))
        }
        return false
      } else {
        // 单选题、判断题、填空题
        return String(userAnswer).toLowerCase() === String(correctAnswer).toLowerCase()
      }
    },
    
    goToQuestion(index: number) {
      if (index >= 0 && index < this.questions.length) {
        this.currentQuestionIndex = index
      }
    },
    
    nextQuestion() {
      if (this.canGoNext) {
        this.currentQuestionIndex++
      }
    },
    
    previousQuestion() {
      if (this.canGoPrevious) {
        this.currentQuestionIndex--
      }
    },
    
    async submitHomework() {
      if (!this.currentHomework) return
      
      const answers = Array.from(this.userAnswers.values())
      
      try {
        const result = await homeworkAPI.submitHomework({
          homeworkId: this.currentHomework.id,
          answers
        })
        
        ElMessage.success('作业提交成功！')
        return result
      } catch (error) {
        console.error('Failed to submit homework:', error)
        ElMessage.error('作业提交失败')
        throw error
      }
    },
    
    async loadStats() {
      try {
        this.stats = await homeworkAPI.getStats()
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    },
    
    reset() {
      this.currentHomework = null
      this.questions = []
      this.currentQuestionIndex = 0
      this.userAnswers.clear()
      this.timeStarted = null
    }
  }
})
