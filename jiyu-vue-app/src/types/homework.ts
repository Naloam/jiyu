export interface Question {
  id: string
  type: 'single' | 'multiple' | 'judgment' | 'fill' | 'essay'
  subject: string
  difficulty: 'easy' | 'medium' | 'hard'
  title: string
  content: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  tags: string[]
  source: string
  createTime: string
}

export interface UserAnswer {
  questionId: string
  answer: string | string[]
  isCorrect: boolean
  submitTime: string
  timeSpent: number
}

export interface DailyHomework {
  id: string
  date: string
  questions: Question[]
  totalQuestions: number
  completedQuestions: number
  correctCount: number
  accuracy: number
  totalTime: number
  status: 'pending' | 'in-progress' | 'completed'
}

export interface HomeworkStats {
  totalDays: number
  completedDays: number
  totalQuestions: number
  correctCount: number
  averageAccuracy: number
  streakDays: number
  weeklyStats: {
    date: string
    accuracy: number
    questionCount: number
  }[]
}
