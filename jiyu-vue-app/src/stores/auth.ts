import { defineStore } from 'pinia'
import { authAPI } from '@/services/auth'
import type { User, LoginCredentials, RegisterData } from '@/types/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('jiyu_token'),
    isAuthenticated: !!localStorage.getItem('jiyu_token'),
    isLoading: false
  }),
  
  getters: {
    username: (state) => state.user?.username || '',
    avatar: (state) => state.user?.avatar || '',
    userLevel: (state) => state.user?.level || 1,
    experience: (state) => state.user?.experience || 0,
    userId: (state) => state.user?.id || ''
  },
  
  actions: {
    async login(credentials: LoginCredentials) {
      this.isLoading = true
      try {
        const response = await authAPI.login(credentials)
        
        if (response.success && response.token) {
          this.token = response.token
          this.isAuthenticated = true
          
          // 保存token到localStorage
          localStorage.setItem('jiyu_token', response.token)
          
          // 获取用户信息
          const userResult = await authAPI.getUserInfo()
          if (userResult.success && userResult.user) {
            this.user = userResult.user
            localStorage.setItem('jiyu_user', JSON.stringify(userResult.user))
          }
          
          return { 
            success: true, 
            message: response.message || '登录成功' 
          }
        } else {
          return { 
            success: false, 
            message: response.message || '登录失败' 
          }
        }
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.message || '登录失败' 
        }
      } finally {
        this.isLoading = false
      }
    },
    
    async register(data: RegisterData) {
      this.isLoading = true
      try {
        const response = await authAPI.register(data)
        return { 
          success: response.success,
          message: response.message 
        }
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.message || '注册失败' 
        }
      } finally {
        this.isLoading = false
      }
    },
    
    async getUserInfo() {
      if (!this.token) return false
      
      try {
        const result = await authAPI.getUserInfo()
        if (result.success && result.user) {
          this.user = result.user
          this.isAuthenticated = true
          localStorage.setItem('jiyu_user', JSON.stringify(result.user))
          return true
        } else {
          this.logout()
          return false
        }
      } catch (error) {
        console.error('Get user info error:', error)
        this.logout()
        return false
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('jiyu_token')
      localStorage.removeItem('jiyu_user')
      console.log('Logout completed, localStorage cleared')
    },
    
    async updateProfile(data: Partial<User>) {
      try {
        const user = await authAPI.updateProfile(data)
        if (this.user) {
          this.user = { ...this.user, ...user }
        }
        return { success: true }
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.message || '更新失败' 
        }
      }
    }
  }
})
