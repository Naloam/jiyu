<template>
  <ScrollContainer class="daily-practice-container" height="100vh">
    <!-- 页面头部 -->
    <div class="practice-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <el-icon><EditPen /></el-icon>
            每日刷题
          </h1>
          <p class="page-subtitle">坚持每日练习，提升编程技能</p>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="$router.push('/chat')" :icon="ChatDotRound" size="large">
            智能问答
          </el-button>
          <el-button @click="$router.push('/')" :icon="ArrowLeft">
            返回主页
          </el-button>
        </div>
      </div>
    </div>

    <!-- 今日统计 -->
    <div class="daily-stats">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <el-icon class="stat-icon" color="#409EFF"><Trophy /></el-icon>
              <div class="stat-info">
                <div class="stat-value">{{ todayCompleted }}</div>
                <div class="stat-label">今日完成</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <el-icon class="stat-icon" color="#67C23A"><Clock /></el-icon>
              <div class="stat-info">
                <div class="stat-value">{{ streak }}</div>
                <div class="stat-label">连续天数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <el-icon class="stat-icon" color="#E6A23C"><Star /></el-icon>
              <div class="stat-info">
                <div class="stat-value">{{ totalPoints }}</div>
                <div class="stat-label">总积分</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <el-icon class="stat-icon" color="#F56C6C"><DataLine /></el-icon>
              <div class="stat-info">
                <div class="stat-value">{{ accuracy }}%</div>
                <div class="stat-label">正确率</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 题目分类选择 -->
    <div class="category-selector">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>选择练习类型</span>
          </div>
        </template>
        <el-row :gutter="16">
          <el-col :span="8" v-for="category in categories" :key="category.id">
            <div 
              class="category-item" 
              :class="{ active: selectedCategory?.id === category.id }"
              @click="selectCategory(category)"
            >
              <el-icon :size="40" :color="category.color">
                <component :is="category.icon" />
              </el-icon>
              <h3>{{ category.name }}</h3>
              <p>{{ category.description }}</p>
              <div class="category-stats">
                <span>{{ category.questionCount }} 题</span>
                <span>难度: {{ category.difficulty }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 题目练习区域 -->
    <div v-if="selectedCategory && currentQuestion" class="practice-area">
      <el-card>
        <template #header>
          <div class="practice-header-content">
            <span>{{ selectedCategory.name }} - 第 {{ currentQuestionIndex + 1 }} 题</span>
            <div class="progress-info">
              <el-progress 
                :percentage="progressPercentage" 
                :stroke-width="8"
                status="primary"
              />
            </div>
          </div>
        </template>

        <!-- 题目内容 -->
        <div class="question-content">
          <h3>{{ currentQuestion.title }}</h3>
          <div class="question-description" v-html="currentQuestion.description"></div>
          
          <!-- 选择题选项 -->
          <div v-if="currentQuestion.type === 'choice'" class="options">
            <el-radio-group v-model="userAnswer" @change="handleAnswerChange">
              <el-radio 
                v-for="(option, index) in currentQuestion.options" 
                :key="index" 
                :label="option.key"
                class="option-item"
              >
                {{ option.key }}. {{ option.text }}
              </el-radio>
            </el-radio-group>
          </div>

          <!-- 编程题答题区 -->
          <div v-if="currentQuestion.type === 'coding'" class="coding-area">
            <el-input
              v-model="codeAnswer"
              type="textarea"
              :rows="10"
              placeholder="请在此处编写您的代码..."
              class="code-editor"
            />
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="practice-actions">
          <el-button @click="previousQuestion" :disabled="currentQuestionIndex === 0">
            上一题
          </el-button>
          <el-button type="primary" @click="submitAnswer" :loading="submitting">
            {{ submitted ? '查看解析' : '提交答案' }}
          </el-button>
          <el-button @click="nextQuestion" :disabled="currentQuestionIndex >= selectedCategory.questions.length - 1">
            下一题
          </el-button>
          <el-button type="info" @click="showHint" v-if="!submitted">
            提示
          </el-button>
        </div>

        <!-- 答案解析 -->
        <div v-if="submitted && showExplanation" class="explanation">
          <el-divider content-position="left">答案解析</el-divider>
          <div class="result-info">
            <el-tag :type="isCorrect ? 'success' : 'danger'" size="large">
              {{ isCorrect ? '回答正确！' : '回答错误' }}
            </el-tag>
            <span v-if="!isCorrect" class="correct-answer">
              正确答案：{{ currentQuestion.correctAnswer }}
            </span>
          </div>
          <div class="explanation-content">
            {{ currentQuestion.explanation }}
          </div>
        </div>
      </el-card>
    </div>

    <!-- 选择提示 -->
    <div v-if="!selectedCategory" class="empty-state">
      <el-empty description="请选择一个练习类型开始刷题">
        <el-button type="primary" @click="selectCategory(categories[0])">
          开始练习
        </el-button>
      </el-empty>
    </div>
  </ScrollContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ScrollContainer from '@/components/common/ScrollContainer.vue'
import { 
  EditPen, 
  ChatDotRound, 
  ArrowLeft,
  Trophy,
  Clock,
  Star,
  DataLine,
  Cpu,
  Document,
  Lightning
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 数据状态
const todayCompleted = ref(5)
const streak = ref(12)
const totalPoints = ref(1248)
const accuracy = ref(87)

const selectedCategory = ref<any>(null)
const currentQuestionIndex = ref(0)
const userAnswer = ref('')
const codeAnswer = ref('')
const submitted = ref(false)
const submitting = ref(false)
const showExplanation = ref(false)

// 题目分类
const categories = ref([
  {
    id: 1,
    name: '算法基础',
    description: '数组、字符串、基础算法',
    icon: Cpu,
    color: '#409EFF',
    difficulty: '简单',
    questionCount: 50,
    questions: [
      {
        id: 1,
        title: '两数之和',
        type: 'choice',
        description: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。',
        options: [
          { key: 'A', text: '暴力解法，时间复杂度 O(n²)' },
          { key: 'B', text: '哈希表，时间复杂度 O(n)' },
          { key: 'C', text: '排序+双指针，时间复杂度 O(nlogn)' },
          { key: 'D', text: '以上都可以' }
        ],
        correctAnswer: 'D',
        explanation: '三种方法都可以解决两数之和问题，其中哈希表的方法时间复杂度最优。'
      }
    ]
  },
  {
    id: 2,
    name: '数据结构',
    description: '链表、栈、队列、树',
    icon: Document,
    color: '#67C23A',
    difficulty: '中等',
    questionCount: 35,
    questions: [
      {
        id: 2,
        title: '反转链表',
        type: 'coding',
        description: '给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。',
        correctAnswer: 'iterative or recursive solution',
        explanation: '可以使用迭代或递归的方法来反转链表。'
      }
    ]
  },
  {
    id: 3,
    name: '动态规划',
    description: '经典DP问题解析',
    icon: Lightning,
    color: '#E6A23C',
    difficulty: '困难',
    questionCount: 25,
    questions: [
      {
        id: 3,
        title: '爬楼梯',
        type: 'choice',
        description: '假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？',
        options: [
          { key: 'A', text: 'f(n) = f(n-1) + f(n-2)' },
          { key: 'B', text: 'f(n) = f(n-1) * f(n-2)' },
          { key: 'C', text: 'f(n) = 2^n' },
          { key: 'D', text: 'f(n) = n!' }
        ],
        correctAnswer: 'A',
        explanation: '这是一个典型的斐波那契数列问题，f(n) = f(n-1) + f(n-2)。'
      }
    ]
  }
])

// 计算属性
const currentQuestion = computed(() => {
  if (!selectedCategory.value || !selectedCategory.value.questions) return null
  return selectedCategory.value.questions[currentQuestionIndex.value]
})

const progressPercentage = computed(() => {
  if (!selectedCategory.value) return 0
  return Math.round(((currentQuestionIndex.value + 1) / selectedCategory.value.questions.length) * 100)
})

const isCorrect = computed(() => {
  if (!currentQuestion.value) return false
  if (currentQuestion.value.type === 'choice') {
    return userAnswer.value === currentQuestion.value.correctAnswer
  }
  return false // 编程题需要后端判断
})

// 方法
const selectCategory = (category: any) => {
  selectedCategory.value = category
  currentQuestionIndex.value = 0
  userAnswer.value = ''
  codeAnswer.value = ''
  submitted.value = false
  showExplanation.value = false
}

const handleAnswerChange = () => {
  console.log('答案选择:', userAnswer.value)
}

const submitAnswer = () => {
  if (submitted.value) {
    showExplanation.value = !showExplanation.value
    return
  }

  if (!userAnswer.value && !codeAnswer.value) {
    ElMessage.warning('请先选择或填写答案')
    return
  }

  submitting.value = true
  setTimeout(() => {
    submitted.value = true
    showExplanation.value = true
    submitting.value = false
    
    if (isCorrect.value) {
      ElMessage.success('恭喜答对了！')
      totalPoints.value += 10
    } else {
      ElMessage.error('答案不正确，请查看解析')
    }
  }, 1000)
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    resetQuestion()
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < selectedCategory.value.questions.length - 1) {
    currentQuestionIndex.value++
    resetQuestion()
  }
}

const resetQuestion = () => {
  userAnswer.value = ''
  codeAnswer.value = ''
  submitted.value = false
  showExplanation.value = false
}

const showHint = () => {
  ElMessage.info('提示：仔细分析题目要求，考虑时间和空间复杂度')
}

onMounted(() => {
  console.log('每日刷题页面已加载')
})
</script>

<style scoped>
.daily-practice-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.practice-header {
  margin-bottom: 32px;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .header-left {
    text-align: left;
  }
  
  .header-right {
    flex-shrink: 0;
    display: flex;
    gap: 10px;
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
    color: #606266;
    margin: 0;
    font-size: 14px;
  }
}

.daily-stats {
  margin-bottom: 30px;
}

.stat-card {
  text-align: center;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.stat-icon {
  font-size: 30px;
}

.stat-info {
  text-align: left;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.category-selector {
  margin-bottom: 30px;
}

.category-item {
  text-align: center;
  padding: 20px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 16px;
}

.category-item:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.category-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.category-item h3 {
  margin: 10px 0;
  color: #303133;
}

.category-item p {
  color: #606266;
  font-size: 14px;
  margin-bottom: 10px;
}

.category-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.practice-area {
  margin-bottom: 30px;
}

.practice-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-info {
  width: 200px;
}

.question-content {
  margin-bottom: 30px;
}

.question-description {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  line-height: 1.6;
}

.options {
  margin: 20px 0;
}

.option-item {
  display: block;
  margin-bottom: 15px;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  transition: all 0.3s;
}

.option-item:hover {
  background-color: #f0f9ff;
  border-color: #409eff;
}

.coding-area {
  margin: 20px 0;
}

.code-editor {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.practice-actions {
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid #e4e7ed;
  margin-top: 20px;
}

.practice-actions .el-button {
  margin: 0 10px;
}

.explanation {
  margin-top: 20px;
  padding: 20px 0;
}

.result-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.correct-answer {
  color: #f56c6c;
  font-weight: bold;
}

.explanation-content {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  line-height: 1.6;
}

.empty-state {
  text-align: center;
  padding: 50px 0;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .practice-header .header-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .header-right {
    width: 100%;
    justify-content: center;
  }
  
  .daily-practice-container {
    padding: 10px;
  }
}
</style>
