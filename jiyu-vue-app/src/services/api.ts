// API配置 - 用于与后端Flask服务通信
import axios, { 
  type AxiosInstance, 
  type InternalAxiosRequestConfig, 
  type AxiosResponse,
  type AxiosRequestConfig 
} from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从存储中获取token
    const authStore = useAuthStore()
    const token = authStore.token || localStorage.getItem('token')
    
    // 如果有token，添加到请求头
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 显示加载状态
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    ElMessage.error('请求配置错误')
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response:', response.status, response.config.url)
    
    // 检查响应状态
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      console.error('Response Error:', response.status, response.statusText)
      ElMessage.error(`请求失败: ${response.status} ${response.statusText}`)
      return Promise.reject(new Error(`HTTP ${response.status}: ${response.statusText}`))
    }
  },
  (error) => {
    console.error('Response Error:', error)
    
    // 处理网络错误
    if (!error.response) {
      ElMessage.error('网络连接失败，请检查网络设置')
      return Promise.reject(error)
    }
    
    // 处理HTTP错误状态码
    const { status, data } = error.response
    
    switch (status) {
      case 401:
        // 未授权，清除token并跳转到登录页
        const authStore = useAuthStore()
        authStore.logout()
        localStorage.removeItem('token')
        ElMessage.error('登录已过期，请重新登录')
        router.push('/login')
        break
      case 403:
        ElMessage.error('权限不足，无法访问该资源')
        break
      case 404:
        ElMessage.error('请求的资源不存在')
        break
      case 422:
        ElMessage.error(data?.message || '请求参数错误')
        break
      case 500:
        ElMessage.error('服务器内部错误，请稍后重试')
        break
      case 502:
      case 503:
      case 504:
        ElMessage.error('服务器暂时不可用，请稍后重试')
        break
      default:
        ElMessage.error(data?.message || `请求失败: ${status}`)
    }
    
    return Promise.reject(error)
  }
)

// 通用请求方法
export const apiRequest = {
  // GET请求
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return api.get(url, config)
  },
  
  // POST请求
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return api.post(url, data, config)
  },
  
  // PUT请求
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return api.put(url, data, config)
  },
  
  // DELETE请求
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return api.delete(url, config)
  },
  
  // PATCH请求
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return api.patch(url, data, config)
  }
}

// 文件上传请求
export const uploadFile = (url: string, file: File, onUploadProgress?: (progressEvent: any) => void) => {
  const formData = new FormData()
  formData.append('file', file)
  
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })
}

// 导出默认的axios实例
export default api
