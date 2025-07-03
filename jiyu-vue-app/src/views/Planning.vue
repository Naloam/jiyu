<template>
  <ScrollContainer class="planning-container" height="100vh">
    <!-- 页面头部 -->
    <div class="planning-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <el-icon><Calendar /></el-icon>
            事项规划
          </h1>
          <p class="page-subtitle">管理您的学习计划和待办事项</p>
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
    
    <div class="todo-app">
      <h2 class="title">今日待办事项</h2>

      <div class="todo-form">
        <el-input
          v-model="newTaskText"
          class="todo-input"
          placeholder="添加新任务..."
          @keypress.enter="addNewTask"
        />
        <el-button
          type="primary"
          class="todo-button"
          @click="addNewTask"
        >
          添加任务
        </el-button>
      </div>

      <div class="todo-list">
        <div
          v-for="(task, index) in tasks"
          :key="index"
          class="item"
          :class="{ completed: task.completed }"
        >
          <span>{{ task.text }}</span>
          <div class="controls">
            <el-button
              size="small"
              :type="task.completed ? 'info' : 'success'"
              @click="toggleTask(index)"
            >
              {{ task.completed ? '恢复' : '完成' }}
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteTask(index)"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>

      <div class="progress-container">
        <el-progress
          :percentage="progressPercentage"
          :color="progressColor"
          :stroke-width="12"
        />
      </div>
    </div>
  </ScrollContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ScrollContainer from '@/components/common/ScrollContainer.vue'
import { Calendar, ChatDotRound, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

interface Task {
  text: string
  completed: boolean
}

const newTaskText = ref('')
const tasks = ref<Task[]>([])

const progressPercentage = computed(() => {
  if (tasks.value.length === 0) return 0
  const completedTasks = tasks.value.filter(task => task.completed).length
  return Math.round((completedTasks / tasks.value.length) * 100)
})

const progressColor = computed(() => {
  const percentage = progressPercentage.value
  if (percentage < 30) return '#f56c6c'
  if (percentage < 70) return '#e6a23c'
  return '#67c23a'
})

const addNewTask = () => {
  const task = newTaskText.value.trim()
  if (task) {
    tasks.value.push({
      text: task,
      completed: false
    })
    newTaskText.value = ''
    saveTasks()
  }
}

const toggleTask = (index: number) => {
  tasks.value[index].completed = !tasks.value[index].completed
  saveTasks()
}

const deleteTask = (index: number) => {
  tasks.value.splice(index, 1)
  saveTasks()
}

const saveTasks = () => {
  localStorage.setItem('todoTasks', JSON.stringify(tasks.value))
}

const loadTasks = () => {
  const savedTasks = localStorage.getItem('todoTasks')
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks)
  }
}

onMounted(() => {
  loadTasks()
})
</script>

<style scoped>
:root {
  --primary-color: #a4f5ec;
  --secondary-color: #048d65;
  --background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.planning-container {
  background: var(--background);
  padding: 20px;
}

.planning-header {
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

.todo-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(132, 206, 246, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.todo-app::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(119, 172, 234, 0.091), transparent);
  transform: rotate(30deg);
  pointer-events: none;
}

.title {
  font-size: 2.5rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 2rem;
}

.todo-input {
  flex: 1;
}

.todo-input :deep(.el-input__inner) {
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.todo-input :deep(.el-input__inner):focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 8px rgba(94, 114, 235, 0.3);
}

.todo-button {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.todo-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(94, 114, 235, 0.3);
}

.todo-list {
  margin: 1.5rem 0;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  margin: 1rem 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item.completed {
  opacity: 0.6;
  background: #f8f9fa;
}

.item.completed span {
  text-decoration: line-through;
}

.controls {
  display: flex;
  gap: 0.8rem;
}

.progress-container {
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .todo-app {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .todo-form {
    flex-direction: column;
  }
  
  .todo-button {
    width: 100%;
  }
  
  .item {
    padding: 0.8rem;
    margin: 0.8rem 0;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .controls {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
