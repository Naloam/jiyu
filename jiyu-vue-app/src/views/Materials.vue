<template>
  <ScrollContainer class="materials-container" height="100vh">
    <!-- 顶部导航栏 -->
    <div class="materials-header">
      <div class="header-left">
        <h1 class="page-title">
          <el-icon><Reading /></el-icon>
          学习资料
        </h1>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="goToChat" :icon="ChatDotRound">
          智能问答
        </el-button>
        <el-button @click="goBack" :icon="ArrowLeft">返回主页</el-button>
      </div>
    </div>

    <!-- 视图切换选项 -->
    <div class="view-selector">
      <el-radio-group v-model="viewMode" @change="handleViewChange">
        <el-radio-button label="traditional">传统视图</el-radio-button>
        <el-radio-button label="navigator">知识导航</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 传统视图 -->
      <div v-if="viewMode === 'traditional'" class="traditional-view">
        <el-row :gutter="20">
          <el-col :span="8" v-for="category in materialCategories" :key="category.id">
            <el-card class="material-card" shadow="hover" @click="selectCategory(category)">
              <div class="card-header">
                <el-icon :size="40" :color="category.color">
                  <component :is="category.icon" />
                </el-icon>
                <h3>{{ category.title }}</h3>
              </div>
              <p class="card-description">{{ category.description }}</p>
              <div class="card-stats">
                <span>{{ category.count }} 个资源</span>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 资源列表 -->
        <div v-if="selectedCategory" class="resource-list">
          <h2>{{ selectedCategory.title }} - 学习资源</h2>
          <el-table :data="selectedCategory.resources" stripe style="width: 100%">
            <el-table-column prop="name" label="资源名称" />
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column prop="difficulty" label="难度" width="100">
              <template #default="scope">
                <el-tag :type="getDifficultyType(scope.row.difficulty)">
                  {{ scope.row.difficulty }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="lastUpdated" label="更新时间" width="120" />
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button size="small" type="primary" @click="openResource(scope.row)">
                  学习
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 知识导航视图 -->
      <div v-if="viewMode === 'navigator'" class="navigator-view">
        <Navigator />
      </div>
    </div>
  </ScrollContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navigator from './Navigator.vue'
import ScrollContainer from '@/components/common/ScrollContainer.vue'
import { 
  Reading, 
  ChatDotRound, 
  ArrowLeft,
  Document,
  VideoPlay,
  Cpu,
  Star
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 路由
const router = useRouter()

// 视图模式
const viewMode = ref('traditional')

// 选中的分类
const selectedCategory = ref<any>(null)

// 学习资料分类
const materialCategories = ref([
  {
    id: 1,
    title: '基础知识',
    description: '编程基础、算法入门等基础学习资料',
    icon: Document,
    color: '#409EFF',
    count: 25,
    resources: [
      { name: 'Python基础教程', type: '视频', difficulty: '初级', lastUpdated: '2024-06-20' },
      { name: 'JavaScript入门', type: '文档', difficulty: '初级', lastUpdated: '2024-06-18' },
      { name: '数据结构基础', type: '课件', difficulty: '中级', lastUpdated: '2024-06-15' }
    ]
  },
  {
    id: 2,
    title: '进阶教程',
    description: '深入学习高级编程概念和技术',
    icon: Cpu,
    color: '#67C23A',
    count: 18,
    resources: [
      { name: 'Vue.js高级开发', type: '视频', difficulty: '高级', lastUpdated: '2024-06-22' },
      { name: '设计模式详解', type: '文档', difficulty: '高级', lastUpdated: '2024-06-19' },
      { name: '微服务架构', type: '课件', difficulty: '高级', lastUpdated: '2024-06-17' }
    ]
  },
  {
    id: 3,
    title: '实战项目',
    description: '通过实际项目提升编程能力',
    icon: Star,
    color: '#E6A23C',
    count: 12,
    resources: [
      { name: '全栈Web应用开发', type: '项目', difficulty: '高级', lastUpdated: '2024-06-21' },
      { name: '移动端APP开发', type: '项目', difficulty: '中级', lastUpdated: '2024-06-16' },
      { name: '数据分析平台', type: '项目', difficulty: '高级', lastUpdated: '2024-06-14' }
    ]
  }
])

// 方法
const handleViewChange = (value: string) => {
  console.log('视图切换到:', value)
  selectedCategory.value = null
}

const selectCategory = (category: any) => {
  selectedCategory.value = category
}

const getDifficultyType = (difficulty: string) => {
  switch (difficulty) {
    case '初级': return 'success'
    case '中级': return 'warning' 
    case '高级': return 'danger'
    default: return 'info'
  }
}

const openResource = (resource: any) => {
  ElMessage.success(`正在打开资源: ${resource.name}`)
  // 这里可以添加打开资源的逻辑
}

const goToChat = () => {
  router.push('/chat')
}

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  console.log('Materials页面已挂载')
})
</script>

<style scoped>
.materials-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.materials-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  color: #303133;
}

.header-right {
  display: flex;
  gap: 10px;
}

.view-selector {
  margin-bottom: 20px;
  text-align: center;
}

.content-area {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.traditional-view {
  min-height: 500px;
}

.material-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.material-card:hover {
  transform: translateY(-2px);
}

.card-header {
  text-align: center;
  margin-bottom: 15px;
}

.card-header h3 {
  margin: 10px 0 0 0;
  color: #303133;
}

.card-description {
  color: #606266;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
}

.card-stats {
  text-align: center;
  color: #909399;
  font-size: 12px;
}

.resource-list {
  margin-top: 30px;
}

.resource-list h2 {
  margin-bottom: 20px;
  color: #303133;
}

.navigator-view {
  min-height: 500px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .materials-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .header-right {
    width: 100%;
    justify-content: center;
  }
  
  .materials-container {
    padding: 10px;
  }
}
</style>
