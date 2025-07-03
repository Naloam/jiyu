<template>
  <div class="register-container">
    <div class="register-background">
      <div class="background-overlay"></div>
    </div>
    
    <div class="register-content">
      <div class="register-card">
        <div class="register-header">
          <div class="logo-area">
            <img src="@/assets/jiyu.jpg" alt="JiYu Learning" class="logo" />
            <h1 class="app-name">积语伴学</h1>
          </div>
          <p class="register-subtitle">创建您的学习账户</p>
        </div>

        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="register-form"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="用户名"
              size="large"
              :prefix-icon="User"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="邮箱地址"
              size="large"
              :prefix-icon="Message"
              type="email"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="密码"
              size="large"
              :prefix-icon="Lock"
              show-password
              maxlength="50"
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="确认密码"
              size="large"
              :prefix-icon="Lock"
              show-password
              maxlength="50"
            />
          </el-form-item>

          <el-form-item prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="手机号码（可选）"
              size="large"
              :prefix-icon="Phone"
              maxlength="11"
            />
          </el-form-item>

          <el-form-item prop="verificationCode" v-if="showVerificationCode">
            <div class="verification-input">
              <el-input
                v-model="registerForm.verificationCode"
                placeholder="验证码"
                size="large"
                :prefix-icon="Key"
                maxlength="6"
              />
              <el-button
                @click="sendVerificationCode"
                :disabled="codeSendDisabled"
                :loading="sendingCode"
                class="send-code-btn"
              >
                {{ codeButtonText }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item prop="agreement">
            <el-checkbox v-model="registerForm.agreement">
              我已阅读并同意
              <el-link type="primary" @click="showTerms = true">《用户协议》</el-link>
              和
              <el-link type="primary" @click="showPrivacy = true">《隐私政策》</el-link>
            </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              @click="handleRegister"
              :loading="registerLoading"
              class="register-btn"
            >
              注册账户
            </el-button>
          </el-form-item>
        </el-form>

        <div class="register-footer">
          <div class="login-link">
            已有账户？
            <router-link to="/login" class="link">立即登录</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户协议弹窗 -->
    <el-dialog v-model="showTerms" title="用户协议" width="600px">
      <div class="terms-content">
        <h3>1. 服务条款</h3>
        <p>欢迎使用几语学习平台。通过访问和使用本平台，您同意遵守以下条款和条件。</p>
        
        <h3>2. 用户责任</h3>
        <p>用户承诺提供真实、准确的注册信息，并保证账户安全。</p>
        
        <h3>3. 服务内容</h3>
        <p>本平台为用户提供在线学习、智能问答、每日刷题等教育服务。</p>
        
        <h3>4. 知识产权</h3>
        <p>平台上的所有内容，包括但不限于文字、图片、音频、视频等，均受知识产权法保护。</p>
        
        <h3>5. 免责声明</h3>
        <p>平台不对用户学习效果做出保证，学习效果因人而异。</p>
      </div>
      <template #footer>
        <el-button @click="showTerms = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 隐私政策弹窗 -->
    <el-dialog v-model="showPrivacy" title="隐私政策" width="600px">
      <div class="privacy-content">
        <h3>1. 信息收集</h3>
        <p>我们仅收集为您提供服务所必需的个人信息，包括用户名、邮箱、学习记录等。</p>
        
        <h3>2. 信息使用</h3>
        <p>您的个人信息仅用于提供学习服务、改进用户体验和发送重要通知。</p>
        
        <h3>3. 信息保护</h3>
        <p>我们采用行业标准的安全措施保护您的个人信息，防止未经授权的访问、使用或披露。</p>
        
        <h3>4. 信息共享</h3>
        <p>除法律要求外，我们不会向第三方分享您的个人信息。</p>
        
        <h3>5. 数据存储</h3>
        <p>您的数据存储在安全的服务器上，我们会定期备份以防数据丢失。</p>
      </div>
      <template #footer>
        <el-button @click="showPrivacy = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock, Message, Phone, Key } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const registerFormRef = ref<FormInstance>()
const registerLoading = ref(false)
const sendingCode = ref(false)
const showVerificationCode = ref(false)
const showTerms = ref(false)
const showPrivacy = ref(false)
const codeCountdown = ref(0)

// 表单数据
const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  verificationCode: '',
  agreement: false
})

// 验证码倒计时
const codeSendDisabled = computed(() => codeCountdown.value > 0)
const codeButtonText = computed(() => {
  return codeCountdown.value > 0 ? `${codeCountdown.value}s后重发` : '发送验证码'
})

// 自定义验证规则
const validatePassword = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度不能少于6位'))
  } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value) && !/(?=.*\d)/.test(value)) {
    callback(new Error('密码应包含大小写字母或数字'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请确认密码'))
  } else if (value !== registerForm.value.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validatePhone = (rule: any, value: any, callback: any) => {
  if (value && !/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}

const validateAgreement = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请阅读并同意用户协议和隐私政策'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在2-20个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含中文、英文、数字和下划线', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  phone: [
    { validator: validatePhone, trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为6位', trigger: 'blur' }
  ],
  agreement: [
    { validator: validateAgreement, trigger: 'change' }
  ]
}

// 发送验证码
const sendVerificationCode = async (): Promise<void> => {
  // 先验证邮箱
  if (!registerForm.value.email) {
    ElMessage.warning('请先输入邮箱地址')
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.value.email)) {
    ElMessage.warning('请输入正确的邮箱地址')
    return
  }

  try {
    sendingCode.value = true
    
    // 模拟发送验证码API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showVerificationCode.value = true
    startCountdown()
    ElMessage.success('验证码已发送到您的邮箱')
  } catch (error) {
    ElMessage.error('验证码发送失败，请稍后重试')
  } finally {
    sendingCode.value = false
  }
}

// 开始倒计时
const startCountdown = (): void => {
  codeCountdown.value = 60
  const timer = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 处理注册
const handleRegister = async (): Promise<void> => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()
    
    registerLoading.value = true

    // 构建注册数据
    const registerData = {
      username: registerForm.value.username,
      email: registerForm.value.email,
      password: registerForm.value.password,
      confirmPassword: registerForm.value.password, // 添加确认密码字段
      phone: registerForm.value.phone,
      verificationCode: registerForm.value.verificationCode
    }

    // 调用注册API
    await authStore.register(registerData)
    
    ElMessage.success('注册成功！')
    
    // 注册成功后跳转到登录页
    router.push('/login')
    
  } catch (error: any) {
    const message = error?.message || '注册失败，请稍后重试'
    ElMessage.error(message)
  } finally {
    registerLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-image: url('@/assets/bg.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
}

.register-background {
  display: none;
}

.background-overlay {
  display: none;
}

.register-content {
  position: relative;
  z-index: 100;
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.register-card {
  background-color: aqua;
  border-radius: 10px;
  box-shadow: 10px 10px 20px rgba(33, 44, 55, 0.3);
  overflow: hidden;
  padding: 40px 30px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.app-name {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-subtitle {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.register-form {
  margin-bottom: 20px;
}

.verification-input {
  display: flex;
  gap: 12px;
}

.verification-input .el-input {
  flex: 1;
}

.send-code-btn {
  white-space: nowrap;
  min-width: 100px;
}

.register-btn {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.register-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.login-link {
  color: #666;
  font-size: 14px;
}

.login-link .link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
}

.login-link .link:hover {
  color: #764ba2;
}

.terms-content,
.privacy-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 20px 0;
}

.terms-content h3,
.privacy-content h3 {
  color: #303133;
  margin: 20px 0 10px 0;
  font-size: 16px;
}

.terms-content p,
.privacy-content p {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 15px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-content {
    max-width: 100%;
    padding: 10px;
  }
  
  .register-card {
    padding: 30px 20px;
    border-radius: 16px;
  }
  
  .app-name {
    font-size: 24px;
  }
  
  .verification-input {
    flex-direction: column;
  }
  
  .send-code-btn {
    min-width: auto;
  }
}

/* Element Plus 组件样式调整 */
:deep(.el-input__wrapper) {
  border-radius: 12px;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

:deep(.el-button) {
  border-radius: 12px;
}

:deep(.el-checkbox__label) {
  font-size: 14px;
  color: #666;
}

:deep(.el-link) {
  font-size: 14px;
}
</style>
