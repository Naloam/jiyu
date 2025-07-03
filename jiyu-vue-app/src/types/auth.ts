export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  level: number
  experience: number
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}
