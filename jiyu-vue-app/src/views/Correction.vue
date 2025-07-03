<template>
  <ScrollContainer class="correction-container" height="100vh">
    <!-- 页面头部 -->
    <div class="correction-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <el-icon><EditPen /></el-icon>
            批改订正
          </h1>
          <p class="page-subtitle">上传题目和答案，获得AI智能批改和建议</p>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="$router.push('/chat')" :icon="ChatDotRound" size="large">
            智能问答
          </el-button>
        </div>
      </div>
      
      <!-- 导航按钮 -->
      <div class="navigation-buttons">
        <el-button-group>
          <el-button @click="$router.push('/dashboard')">返回首页</el-button>
          <el-button @click="$router.push('/materials')">学习资料</el-button>
          <el-button @click="$router.push('/daily-practice')">每日练习</el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 主要操作区域 -->
    <el-row :gutter="24">
      <el-col :xs="24" :md="12">
        <!-- 题目上传区域 -->
        <el-card class="upload-card">
          <template #header>
            <div class="card-header">
              <span>上传题目</span>
              <el-tag :type="questionConfirmed ? 'success' : 'info'" size="small">
                {{ questionConfirmed ? '已确认' : '待确认' }}
              </el-tag>
            </div>
          </template>
          
          <el-input
            v-model="questionText"
            :disabled="questionConfirmed"
            type="textarea"
            :rows="8"
            placeholder="请输入题目内容..."
            show-word-limit
            maxlength="2000"
          />
          
          <div class="button-group">
            <el-button @click="openOCRDialog('question')">
              <el-icon><Camera /></el-icon>
              OCR识别
            </el-button>
            <el-button @click="clearQuestion">
              <el-icon><Delete /></el-icon>
              清空
            </el-button>
            <el-button 
              :type="questionConfirmed ? 'warning' : 'primary'"
              @click="toggleQuestionConfirm"
            >
              <el-icon><Check /></el-icon>
              {{ questionConfirmed ? '解除锁定' : '确认' }}
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="12">
        <!-- 答案上传区域 -->
        <el-card class="upload-card">
          <template #header>
            <div class="card-header">
              <span>上传答案</span>
              <el-tag :type="answerConfirmed ? 'success' : 'info'" size="small">
                {{ answerConfirmed ? '已确认' : '待确认' }}
              </el-tag>
            </div>
          </template>
          
          <el-input
            v-model="answerText"
            :disabled="answerConfirmed"
            type="textarea"
            :rows="8"
            placeholder="请输入答案内容..."
            show-word-limit
            maxlength="2000"
          />
          
          <div class="button-group">
            <el-button @click="openOCRDialog('answer')">
              <el-icon><Camera /></el-icon>
              OCR识别
            </el-button>
            <el-button @click="clearAnswer">
              <el-icon><Delete /></el-icon>
              清空
            </el-button>
            <el-button 
              :type="answerConfirmed ? 'warning' : 'primary'"
              @click="toggleAnswerConfirm"
            >
              <el-icon><Check /></el-icon>
              {{ answerConfirmed ? '解除锁定' : '确认' }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 提交按钮 -->
    <div class="submit-section">
      <el-button 
        type="primary" 
        size="large"
        :disabled="!canSubmit"
        :loading="submitting"
        @click="submitForCorrection"
        class="submit-btn"
      >
        <el-icon><Promotion /></el-icon>
        提交批改
      </el-button>
    </div>

    <!-- 批改结果 -->
    <div v-if="correctionResult" class="result-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>批改结果</span>
            <el-tag :type="getScoreType(correctionResult.score)" size="large">
              得分: {{ correctionResult.score }}
            </el-tag>
          </div>
        </template>
        
        <div class="result-content">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="题目类型">
              {{ correctionResult.type }}
            </el-descriptions-item>
            <el-descriptions-item label="难度等级">
              <el-rate 
                v-model="correctionResult.difficulty" 
                disabled 
                show-score 
                text-color="#ff9900"
              />
            </el-descriptions-item>
            <el-descriptions-item label="知识点">
              <el-tag 
                v-for="point in correctionResult.knowledgePoints" 
                :key="point"
                size="small"
                style="margin-right: 8px;"
              >
                {{ point }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
          
          <div class="feedback-section">
            <h4>详细反馈</h4>
            <div class="feedback-content" v-html="correctionResult.feedback"></div>
          </div>
          
          <div class="suggestions-section">
            <h4>改进建议</h4>
            <ul class="suggestions-list">
              <li v-for="suggestion in correctionResult.suggestions" :key="suggestion">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>

    <!-- OCR对话框 -->
    <el-dialog
      v-model="ocrDialogVisible"
      title="OCR图像识别"
      width="500px"
      @close="stopCamera"
    >
      <div class="ocr-content">
        <video 
          ref="videoRef" 
          class="camera-video"
          autoplay
          playsinline
        ></video>
        
        <div class="ocr-buttons">
          <el-button @click="captureImage">
            <el-icon><Camera /></el-icon>
            拍照识别
          </el-button>
          <el-button @click="stopCamera">
            <el-icon><Close /></el-icon>
            关闭摄像头
          </el-button>
        </div>
      </div>
    </el-dialog>
  </ScrollContainer>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import ScrollContainer from '@/components/common/ScrollContainer.vue'
import { 
  EditPen, Camera, Delete, Check, Promotion, Close, ChatDotRound 
} from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus'

// 数据状态
const questionText = ref('')
const answerText = ref('')
const questionConfirmed = ref(false)
const answerConfirmed = ref(false)
const submitting = ref(false)
const correctionResult = ref<{
  score: number;
  type: string;
  difficulty: number;
  knowledgePoints: string[];
  feedback: string;
  suggestions: string[];
} | null>(null)

// OCR相关
const ocrDialogVisible = ref(false)
const videoRef = ref()
const currentOCRTarget = ref('') // 'question' 或 'answer'
let mediaStream: MediaStream | null = null

// 计算属性
const canSubmit = computed(() => {
  return questionConfirmed.value && 
         answerConfirmed.value && 
         questionText.value.trim() && 
         answerText.value.trim()
})

// 方法
const toggleQuestionConfirm = () => {
  questionConfirmed.value = !questionConfirmed.value
  checkSubmitCondition()
}

const toggleAnswerConfirm = () => {
  answerConfirmed.value = !answerConfirmed.value
  checkSubmitCondition()
}

const clearQuestion = () => {
  questionText.value = ''
  questionConfirmed.value = false
}

const clearAnswer = () => {
  answerText.value = ''
  answerConfirmed.value = false
}

const checkSubmitCondition = () => {
  if (questionConfirmed.value && answerConfirmed.value) {
    ElMessage.success('题目和答案已确认，可以提交批改了！')
  }
}

const submitForCorrection = async () => {
  submitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟批改结果
    correctionResult.value = {
      score: Math.floor(Math.random() * 41) + 60, // 60-100分
      type: '数学应用题',
      difficulty: Math.floor(Math.random() * 3) + 3, // 3-5星
      knowledgePoints: ['函数', '方程', '几何'],
      feedback: `
        <p><strong>答题分析：</strong></p>
        <p>你的解题思路基本正确，能够正确理解题意并选择合适的解题方法。</p>
        <p><strong>优点：</strong></p>
        <ul>
          <li>解题步骤清晰，逻辑性强</li>
          <li>计算过程准确</li>
          <li>结果表达规范</li>
        </ul>
        <p><strong>需要改进的地方：</strong></p>
        <ul>
          <li>部分步骤可以进一步简化</li>
          <li>建议增加验证环节</li>
        </ul>
      `,
      suggestions: [
        '建议加强基础知识的复习',
        '多练习类似题型，提高熟练度',
        '注意答题规范性和完整性',
        '可以尝试多种解题方法，拓展思路'
      ]
    }
    
    ElMessage.success('批改完成！')
    
  } catch (error) {
    ElMessage.error('批改失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

const openOCRDialog = async (target: string) => {
  currentOCRTarget.value = target
  ocrDialogVisible.value = true
  
  await nextTick()
  startCamera()
}

const startCamera = async () => {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment' // 尝试使用后置摄像头
      } 
    })
    
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream
    }
  } catch (error) {
    ElMessage.error('无法访问摄像头，请检查权限设置')
  }
}

const stopCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    mediaStream = null
  }
  ocrDialogVisible.value = false
}

const captureImage = async () => {
  if (!videoRef.value) return
  
  const loading = ElLoading.service({
    lock: true,
    text: 'OCR识别中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  
  try {
    // 创建canvas来捕获图像
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    canvas.width = videoRef.value.videoWidth
    canvas.height = videoRef.value.videoHeight
    
    context?.drawImage(videoRef.value, 0, 0)
    
    // 模拟OCR识别
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockOCRResult = '这是OCR识别的示例文本内容。实际应用中这里会是真实的识别结果。'
    
    // 将结果填入对应的文本框
    if (currentOCRTarget.value === 'question') {
      questionText.value = mockOCRResult
    } else {
      answerText.value = mockOCRResult
    }
    
    ElMessage.success('OCR识别完成！')
    stopCamera()
    
  } catch (error) {
    ElMessage.error('OCR识别失败')
  } finally {
    loading.close()
  }
}

const getScoreType = (score: number) => {
  if (score >= 90) return 'success'
  if (score >= 70) return 'warning'
  return 'danger'
}
</script>

<style scoped lang="scss">
.correction-container {
  padding: 24px;
  background: #f5f7fa;
}

.correction-header {
  margin-bottom: 32px;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .header-left {
    text-align: left;
  }
  
  .header-right {
    flex-shrink: 0;
  }
  
  .page-title {
    font-size: 28px;
    color: #303133;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }
  
  .page-subtitle {
    color: #909399;
    font-size: 16px;
    margin: 0 0 16px 0;
  }
}

.navigation-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.upload-card {
  margin-bottom: 24px;
  border-radius: 12px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }
  
  .button-group {
    margin-top: 16px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
}

.submit-section {
  text-align: center;
  margin: 32px 0;
  
  .submit-btn {
    padding: 16px 48px;
    font-size: 18px;
    border-radius: 24px;
  }
}

.result-section {
  margin-top: 32px;
  
  .result-content {
    .feedback-section,
    .suggestions-section {
      margin-top: 24px;
      
      h4 {
        color: #303133;
        margin-bottom: 12px;
        font-size: 16px;
      }
      
      .feedback-content {
        background: #f8f9fa;
        padding: 16px;
        border-radius: 8px;
        line-height: 1.6;
        
        :deep(p) {
          margin-bottom: 8px;
        }
        
        :deep(ul) {
          margin: 8px 0;
          padding-left: 20px;
        }
      }
      
      .suggestions-list {
        background: #f0f9ff;
        padding: 16px;
        border-radius: 8px;
        margin: 0;
        
        li {
          margin-bottom: 8px;
          color: #606266;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}

.ocr-content {
  text-align: center;
  
  .camera-video {
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
    background: #000;
  }
  
  .ocr-buttons {
    margin-top: 16px;
    display: flex;
    gap: 12px;
    justify-content: center;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .correction-container {
    padding: 16px;
  }
  
  .correction-header .page-title {
    font-size: 24px;
  }
  
  .button-group {
    justify-content: center;
  }
  
  .submit-btn {
    width: 100%;
    padding: 16px 24px;
  }
}
</style>
