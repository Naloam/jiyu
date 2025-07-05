<template>
  <div class="navigator-container">
    <!-- 背景图片 -->
    <div class="background"></div>

    <!-- 全局顶部工具栏 -->
    <GlobalToolbar 
      @toggle-settings="openSettingsModal"
    />

    <!-- 知识导航固定侧栏 -->
    <div v-if="viewMode === 'knowledge'" class="fixed-knowledge-nav">
      <div class="fixed-knowledge-header">
        <h3>知识导航</h3>
      </div>
      <div class="fixed-knowledge-menu">
        <ul>
          <li><a href="#row-1" @click="scrollToSection('row-1')"><el-icon><Edit /></el-icon> 微积分</a></li>
          <li><a href="#row-2" @click="scrollToSection('row-2')"><el-icon><DataAnalysis /></el-icon> 线性代数</a></li>
          <li><a href="#row-3" @click="scrollToSection('row-3')"><el-icon><Collection /></el-icon> 概率统计</a></li>
          <li><a href="#row-4" @click="scrollToSection('row-4')"><el-icon><Clock /></el-icon> 微分方程</a></li>
          <li><a href="#row-5" @click="scrollToSection('row-5')"><el-icon><Tools /></el-icon> 数学建模</a></li>
          <li><a href="#row-6" @click="scrollToSection('row-6')"><el-icon><Edit /></el-icon> 高级数学</a></li>
          <li><a href="#row-7" @click="scrollToSection('row-7')"><el-icon><Setting /></el-icon> 学习工具集成</a></li>
        </ul>
      </div>
    </div>

    <!-- 悬浮导航菜单 -->
    <div class="floating-nav-panel">
      <div class="floating-nav-header">
        <h1 class="logo">
          <img src="@/assets/jiyu.jpg" alt="logo">
          <span>快捷导航</span>
        </h1>
        <el-button 
          class="nav-btn" 
          icon="Menu" 
          @click="toggleSidebar"
        />
      </div>
      
      <nav class="floating-nav-menu">
        <ul>
          <li>
            <router-link to="/dashboard" active-class="active">
              <el-icon><House /></el-icon> 首页
            </router-link>
          </li>
          <li id="favorites-btn" :class="{ active: showFavoritesOnly }">
            <a href="#favorites" @click="scrollToSection('favorites')">
              <el-icon><Star /></el-icon> 收藏 
              <span v-if="favorites.length > 0" class="favorites-count">({{ favorites.length }})</span>
            </a>
          </li>
          <li>
            <a href="#" @click="toggleViewMode" :class="{ active: viewMode === 'programming' }">
              <el-icon><Cpu /></el-icon> 编程资料
            </a>
          </li>
          <li>
            <a href="#" @click="toggleViewMode" :class="{ active: viewMode === 'knowledge' }">
              <el-icon><Reading /></el-icon> 知识导航
            </a>
          </li>
          <li id="settings-btn">
            <a href="#settings" @click="openSettingsModal">
              <el-icon><Setting /></el-icon> 设置
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- 主内容区域 -->
    <div id="content" class="navigator-content">
      <!-- 知识导航视图 -->
      <div v-if="viewMode === 'knowledge'" class="knowledge-view">
        <!-- 主内容 -->
        <div ref="mainContentRef" class="main">
          <div class="container content-box">
            <!-- 搜索区域 -->
          <section class="sousuo">
            <div class="dual-search-container">
              <!-- 通用搜索 -->
              <div class="search">
                <div class="search-box">
                  <el-button class="search-engine-name" @click="toggleSearchEngineList('main')">
                    <el-icon><Search /></el-icon>
                    <span>{{ selectedEngines.main.name }}</span>
                  </el-button>
                  <el-input 
                    v-model="searchQueries.main" 
                    class="search-input" 
                    placeholder="输入关键字，回车搜索"
                    @keyup.enter="doSearch('main')"
                  />
                  <el-button class="search-btn" @click="doSearch('main')">搜索</el-button>
                </div>
                <div class="search-engine" v-show="showEngineList.main">
                  <div class="search-engine-head">
                    <strong>通用引擎：</strong>
                  </div>
                  <ul class="search-engine-list">
                    <li 
                      v-for="engine in searchEngines.main" 
                      :key="engine.id"
                      @click="selectEngine('main', engine)"
                    >
                      {{ engine.name }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- 学术搜索 -->
              <div class="search academic-search">
                <div class="search-box">
                  <el-button class="search-engine-name" @click="toggleSearchEngineList('academic')">
                    <el-icon><Search /></el-icon>
                    <span>{{ selectedEngines.academic.name }}</span>
                  </el-button>
                  <el-input 
                    v-model="searchQueries.academic" 
                    class="search-input" 
                    placeholder="输入学术关键词"
                    @keyup.enter="doSearch('academic')"
                  />
                  <el-button class="search-btn" @click="doSearch('academic')">搜索</el-button>
                </div>
                <div class="search-engine" v-show="showEngineList.academic">
                  <div class="search-engine-head">
                    <strong>学术引擎：</strong>
                  </div>
                  <ul class="search-engine-list">
                    <li 
                      v-for="engine in searchEngines.academic" 
                      :key="engine.id"
                      @click="selectEngine('academic', engine)"
                    >
                      {{ engine.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          <!-- 轮播图 -->
          <section class="carousel-container">
            <div class="carousel" @mouseenter="pauseAutoplay" @mouseleave="resumeAutoplay">
              <div class="carousel-slides" :style="{ transform: `translateX(-${currentSlide * 33.333}%)` }">
                <!-- 第一张：高等数学 -->
                <div class="slide">
                  <a 
                    href="https://www.bilibili.com/video/BV1Eb411u7Fw" 
                    target="_blank" 
                    class="slide-link"
                    @contextmenu.prevent="showContextMenuHandler($event, 'https://www.bilibili.com/video/BV1Eb411u7Fw')"
                  >
                    <img src="@/img/1.jpg" alt="高等数学教学">
                    <div class="slide-content">
                      <h2>宋浩高等数学</h2>
                      <p>点击观看B站完整教学视频课程</p>
                    </div>
                  </a>
                </div>
            
                <!-- 第二张：数学建模 -->
                <div class="slide">
                  <a 
                    href="https://dxs.moe.gov.cn/zx/hd/sxjm/dxsx/dxsxmnsj/" 
                    target="_blank" 
                    class="slide-link"
                    @contextmenu.prevent="showContextMenuHandler($event, 'https://dxs.moe.gov.cn/zx/hd/sxjm/dxsx/dxsxmnsj/')"
                  >
                    <img src="@/img/2.png" alt="数学建模竞赛">
                    <div class="slide-content">
                      <h2>全国数学建模竞赛</h2>
                      <p>官方赛事信息与历年优秀作品</p>
                    </div>
                  </a>
                </div>
            
                <!-- 第三张：考研数学 -->
                <div class="slide">
                  <a 
                    href="https://kmath.cn/math/" 
                    target="_blank" 
                    class="slide-link"
                    @contextmenu.prevent="showContextMenuHandler($event, 'https://kmath.cn/math/')"
                  >
                    <img src="@/img/3.png" alt="考研数学资源">
                    <div class="slide-content">
                      <h2>考研数学宝典</h2>
                      <p>历年真题解析与专题训练</p>
                    </div>
                  </a>
                </div>
              </div>
              
              <!-- 控制按钮 -->
              <button class="carousel-button prev" @click="prevSlide">
                <el-icon><ArrowLeft /></el-icon>
              </button>
              <button class="carousel-button next" @click="nextSlide">
                <el-icon><ArrowRight /></el-icon>
              </button>
              
              <!-- 导航点 -->
              <div class="carousel-dots">
                <div 
                  v-for="(_, index) in 3" 
                  :key="index"
                  class="dot" 
                  :class="{ active: index === currentSlide }"
                  @click="goToSlide(index)"
                ></div>
              </div>
            </div>
          </section>

          <!-- 微积分 -->
          <section class="item card-box" id="row-1">
            <div class="container-fluid">
              <div class="row">
                <div class="item-tit">
                  <strong><el-icon><Edit /></el-icon> 微积分</strong>
                </div>
                <div class="clearfix two-list-box">
                  <div class="resource-card" v-for="(resource, index) in calculusResources" :key="index">
                    <a :href="resource.url" class="card-link" target="_blank"
                       @contextmenu.prevent="showContextMenuHandler($event, resource.url)">
                      <div class="card-tit">{{ resource.title }}</div>
                      <div class="card-desc">{{ resource.description }}</div>
                      <el-button 
                        class="favorite-btn" 
                        :class="{ 'favorited': isFavorited(resource.url) }"
                        @click.prevent.stop="toggleFavorite(resource.url, resource.title)"
                        size="small"
                        circle
                      >
                        <el-icon><Star /></el-icon>
                      </el-button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 线性代数 -->
          <section class="item card-box" id="row-2">
            <div class="container-fluid">
              <div class="row">
                <div class="item-tit">
                  <strong><el-icon><DataAnalysis /></el-icon> 线性代数</strong>
                </div>
                <div class="clearfix two-list-box">
                  <div class="resource-card" v-for="(resource, index) in linearAlgebraResources" :key="index">
                    <a :href="resource.url" class="card-link" target="_blank"
                       @contextmenu.prevent="showContextMenuHandler($event, resource.url)">
                      <div class="card-tit">{{ resource.title }}</div>
                      <div class="card-desc">{{ resource.description }}</div>
                      <el-button 
                        class="favorite-btn" 
                        :class="{ 'favorited': isFavorited(resource.url) }"
                        @click.prevent.stop="toggleFavorite(resource.url, resource.title)"
                        size="small"
                        circle
                      >
                        <el-icon><Star /></el-icon>
                      </el-button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 概率统计 -->
          <section class="item card-box" id="row-3">
            <div class="container-fluid">
              <div class="row">
                <div class="item-tit">
                  <strong><el-icon><Collection /></el-icon> 概率统计</strong>
                </div>
                <div class="clearfix two-list-box">
                  <div class="resource-card" v-for="(resource, index) in statisticsResources" :key="index">
                    <a :href="resource.url" class="card-link" target="_blank"
                       @contextmenu.prevent="showContextMenuHandler($event, resource.url)">
                      <div class="card-tit">{{ resource.title }}</div>
                      <div class="card-desc">{{ resource.description }}</div>
                      <el-button 
                        class="favorite-btn" 
                        :class="{ 'favorited': isFavorited(resource.url) }"
                        @click.prevent.stop="toggleFavorite(resource.url, resource.title)"
                        size="small"
                        circle
                      >
                        <el-icon><Star /></el-icon>
                      </el-button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 微分方程 -->
          <section class="item card-box" id="row-4">
            <div class="container-fluid">
              <div class="row">
                <div class="item-tit">
                  <strong><el-icon><Clock /></el-icon> 微分方程</strong>
                </div>
                <div class="clearfix two-list-box">
                  <div class="resource-card" v-for="(resource, index) in differentialResources" :key="index">
                    <a :href="resource.url" class="card-link" target="_blank"
                       @contextmenu.prevent="showContextMenuHandler($event, resource.url)">
                      <div class="card-tit">{{ resource.title }}</div>
                      <div class="card-desc">{{ resource.description }}</div>
                      <el-button 
                        class="favorite-btn" 
                        :class="{ 'favorited': isFavorited(resource.url) }"
                        @click.prevent.stop="toggleFavorite(resource.url, resource.title)"
                        size="small"
                        circle
                      >
                        <el-icon><Star /></el-icon>
                      </el-button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 数学建模 -->
          <section class="item card-box" id="row-5">
            <div class="container-fluid">
              <div class="row">
                <div class="item-tit">
                  <strong><el-icon><Tools /></el-icon> 数学建模</strong>
                </div>
                <div class="clearfix two-list-box">
                  <div class="resource-card" v-for="(resource, index) in modelingResources" :key="index">
                    <a :href="resource.url" class="card-link" target="_blank"
                       @contextmenu.prevent="showContextMenuHandler($event, resource.url)">
                      <div class="card-tit">{{ resource.title }}</div>
                      <div class="card-desc">{{ resource.description }}</div>
                      <el-button 
                        class="favorite-btn" 
                        :class="{ 'favorited': isFavorited(resource.url) }"
                        @click.prevent.stop="toggleFavorite(resource.url, resource.title)"
                        size="small"
                        circle
                      >
                        <el-icon><Star /></el-icon>
                      </el-button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 高级数学 -->
          <section class="item card-box" id="row-6">
            <div class="container-fluid">
              <div class="row">
                <div class="item-tit">
                  <strong><el-icon><Edit /></el-icon> 高级数学</strong>
                </div>
                <div class="clearfix two-list-box">
                  <div class="resource-card" v-for="(resource, index) in advancedMathResources" :key="index">
                    <a :href="resource.url" class="card-link" target="_blank"
                       @contextmenu.prevent="showContextMenuHandler($event, resource.url)">
                      <div class="card-tit">{{ resource.title }}</div>
                      <div class="card-desc">{{ resource.description }}</div>
                      <el-button 
                        class="favorite-btn" 
                        :class="{ 'favorited': isFavorited(resource.url) }"
                        @click.prevent.stop="toggleFavorite(resource.url, resource.title)"
                        size="small"
                        circle
                      >
                        <el-icon><Star /></el-icon>
                      </el-button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 学习工具集成 -->
          <section class="item card-box" id="row-7">
            <div class="container-fluid">
              <div class="row">
                <div class="item-tit">
                  <strong><el-icon><Setting /></el-icon> 学习工具集成</strong>
                </div>
                <div class="clearfix two-list-box">
                  <div class="resource-card" v-for="(resource, index) in toolsResources" :key="index">
                    <a :href="resource.url" class="card-link" target="_blank"
                       @contextmenu.prevent="showContextMenuHandler($event, resource.url)">
                      <div class="card-tit">{{ resource.title }}</div>
                      <div class="card-desc">{{ resource.description }}</div>
                      <el-button 
                        class="favorite-btn" 
                        :class="{ 'favorited': isFavorited(resource.url) }"
                        @click.prevent.stop="toggleFavorite(resource.url, resource.title)"
                        size="small"
                        circle
                      >
                        <el-icon><Star /></el-icon>
                      </el-button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 收藏夹显示区域 -->
          <section class="item card-box" id="favorites" v-if="showFavoritesOnly">
            <div class="container-fluid">
              <div class="row">
                <div class="item-tit">
                  <strong><el-icon><Star /></el-icon> 我的收藏</strong>
                </div>
                <div class="clearfix two-list-box">
                  <div class="resource-card" v-for="(favorite, index) in favoritesList" :key="index">
                    <a :href="favorite.url" class="card-link" target="_blank"
                       @contextmenu.prevent="showContextMenuHandler($event, favorite.url)">
                      <div class="card-tit">{{ favorite.title }}</div>
                      <div class="card-desc">{{ favorite.description }}</div>
                      <el-button 
                        class="favorite-btn favorited"
                        @click.prevent.stop="removeFavorite(favorite.url)"
                        size="small"
                        circle
                      >
                        <el-icon><Star /></el-icon>
                      </el-button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- 编程资料视图 -->
    <div v-if="viewMode === 'programming'" class="programming-view">
      <div class="programming-content">
        <h1 class="programming-title">编程学习资料</h1>
        <p class="programming-description">
          这里收集了各类编程学习资源，包括基础教程、高级课程和实战项目。选择一个分类开始探索吧！
        </p>
        
        <!-- 资料分类卡片 -->
        <el-row :gutter="20" class="category-cards">
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
      </div>
    </div>
  </div>

    <!-- 返回顶部按钮 -->
    <el-backtop :right="20" :bottom="20" />

    <!-- 设置弹窗 -->
    <el-dialog 
      v-model="showSettingsModal" 
      title="设置" 
      width="500px"
      :before-close="closeSettingsModal"
    >
      <div class="settings-body">
        <div class="setting-item">
          <label>主题</label>
          <el-select v-model="userSettings.theme" @change="updateTheme">
            <el-option label="浅色" value="light" />
            <el-option label="深色" value="dark" />
          </el-select>
        </div>
        
        <div class="setting-item">
          <label>字体大小</label>
          <el-select v-model="userSettings.fontSize" @change="updateFontSize">
            <el-option label="小" value="small" />
            <el-option label="中" value="medium" />
            <el-option label="大" value="large" />
          </el-select>
        </div>
        
        <div class="setting-item">
          <label>背景透明度: {{ userSettings.backgroundOpacity }}</label>
          <el-slider 
            v-model="userSettings.backgroundOpacity" 
            :min="0" 
            :max="1" 
            :step="0.1"
            @change="updateBackgroundOpacity"
          />
        </div>
        
        <div class="setting-item">
          <label>卡片样式</label>
          <el-select v-model="userSettings.cardStyle" @change="updateCardStyle">
            <el-option label="默认" value="default" />
            <el-option label="简约" value="minimal" />
            <el-option label="渐变" value="gradient" />
          </el-select>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeSettingsModal">取消</el-button>
          <el-button type="primary" @click="closeSettingsModal">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编程资料视图模态框 -->
    <el-dialog 
      v-if="selectedCategory"
      v-model="showResourceDialog"
      :title="selectedCategory.title + ' - 学习资源'"
      width="80%"
    >
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
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  House, Search, Link, DocumentCopy, 
  Star, Setting, Tools, Menu, Edit,
  Clock, DataAnalysis, Collection,
  ArrowLeft, ArrowRight, Reading, 
  ChatDotRound, Document, VideoPlay, Cpu
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import GlobalToolbar from '@/components/common/GlobalToolbar.vue'

const router = useRouter()

// 视图模式切换
const viewMode = ref<'knowledge' | 'programming'>('knowledge') // 'knowledge' or 'programming'
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'knowledge' ? 'programming' : 'knowledge'
  console.log('切换视图到:', viewMode.value)
  selectedCategory.value = null
}

// 编程资料相关
const selectedCategory = ref<any>(null)
const showResourceDialog = ref(false)

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

// 编程资料方法
const selectCategory = (category: any) => {
  selectedCategory.value = category
  showResourceDialog.value = true
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

// 侧边栏状态
const sidebarVisible = ref(false)
const mainContentRef = ref<HTMLElement>()

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

// 搜索引擎相关
const searchEngines = reactive({
  main: [
    { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=' },
    { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=' },
    { id: 'baidu', name: 'Baidu', url: 'https://www.baidu.com/s?wd=' },
    { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' }
  ],
  academic: [
    { id: 'scholar', name: 'Google Scholar', url: 'https://scholar.google.com/scholar?q=' },
    { id: 'bing_academic', name: 'Bing Academic', url: 'https://www.bing.com/academic/search?q=' },
    { id: 'arxiv', name: 'arXiv', url: 'https://arxiv.org/search/?query=' },
    { id: 'wolfram', name: 'Wolfram Alpha', url: 'https://www.wolframalpha.com/input?i=' }
  ]
})

const selectedEngines = reactive({
  main: searchEngines.main[0],
  academic: searchEngines.academic[0]
})

const searchQueries = reactive({
  main: '',
  academic: ''
})

const showEngineList = reactive({
  main: false,
  academic: false
})

// 收藏功能
const FAVORITES_KEY = 'navigator_favorites'
const favorites = ref<Array<{url: string, title: string}>>([])
const showFavoritesOnly = ref(false)

// 用户设置
const SETTINGS_KEY = 'navigator_settings'
const userSettings = reactive({
  theme: 'light',
  fontSize: 'medium',
  backgroundOpacity: 0.8,
  cardStyle: 'default'
})

// 轮播图相关
const currentSlide = ref(0)
const slideCount = 3
let autoplayInterval: NodeJS.Timeout | null = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slideCount
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slideCount) % slideCount
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const pauseAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

const resumeAutoplay = () => {
  if (!autoplayInterval) {
    autoplayInterval = setInterval(nextSlide, 5000)
  }
}

const startAutoplay = () => {
  autoplayInterval = setInterval(nextSlide, 5000)
}

// 资源数据
const calculusResources = ref([
  {
    title: 'MIT微积分课程',
    description: 'MIT开放式课程，包含完整教学视频、讲义和习题。',
    url: 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/'
  },
  {
    title: '可汗学院',
    description: '从极限到积分完整知识体系，配套交互练习。',
    url: 'https://www.khanacademy.org/math/calculus-1'
  },
  {
    title: '宋浩高等数学',
    description: 'B站知名数学教师，讲解深入浅出。',
    url: 'https://www.bilibili.com/video/BV1Eb411u7Fw'
  },
  {
    title: '张宇高等数学',
    description: '考研名师，系统讲解高等数学。',
    url: 'https://www.bilibili.com/video/BV1GJ411x7h7'
  },
  {
    title: '汤家凤高等数学',
    description: '考研名师，重点突出，适合基础薄弱者。',
    url: 'https://www.bilibili.com/video/BV1GJ411x7h7'
  },
  {
    title: '武忠祥高等数学',
    description: '考研名师，讲解细致，适合提高。',
    url: 'https://www.bilibili.com/video/BV1GJ411x7h7'
  },
  {
    title: '3Blue1Brown微积分',
    description: '可视化微积分概念，直观理解数学原理。',
    url: 'https://www.3blue1brown.com/topics/calculus'
  },
  {
    title: 'UC Davis微积分习题集',
    description: '包含大量习题和详细解答，按章节分类。',
    url: 'https://www.math.ucdavis.edu/~kouba/CalcOneDIRECTORY/'
  }
])

const linearAlgebraResources = ref([
  {
    title: 'MIT Gilbert Strang 课程',
    description: '线性代数经典课程，深入理解矩阵与向量空间。',
    url: 'https://www.bilibili.com/video/BV1ys411472E'
  },
  {
    title: '交互式线性代数',
    description: '佐治亚理工在线教材，支持3D可视化演示。',
    url: 'https://textbooks.math.gatech.edu/ila/'
  },
  {
    title: '3Blue1Brown线性代数',
    description: '直观理解线性代数的本质，可视化教学。',
    url: 'https://www.3blue1brown.com/topics/linear-algebra'
  },
  {
    title: '李永乐线性代数',
    description: '考研名师，讲解系统全面。',
    url: 'https://www.bilibili.com/video/BV1GJ411x7h7'
  },
  {
    title: '张宇线性代数',
    description: '考研名师，重点突出。',
    url: 'https://www.bilibili.com/video/BV1GJ411x7h7'
  },
  {
    title: '汤家凤线性代数',
    description: '考研名师，适合基础薄弱者。',
    url: 'https://www.bilibili.com/video/BV1GJ411x7h7'
  }
])

const statisticsResources = ref([
  {
    title: '可视化概率统计',
    description: '布朗大学交互式学习平台，直观理解统计概念。',
    url: 'https://seeing-theory.brown.edu/'
  },
  {
    title: '概率论百科全书',
    description: '包含600+个详细案例与解决方案。',
    url: 'https://www.probabilitycourse.com/'
  },
  {
    title: '张宇概率统计',
    description: '考研名师，讲解系统全面。',
    url: 'https://www.bilibili.com/video/BV1VJ411X7Ng'
  },
  {
    title: '汤家凤概率统计',
    description: '考研名师，适合基础薄弱者。',
    url: 'https://www.bilibili.com/video/BV1GJ411x7h7'
  },
  {
    title: '王式安概率统计',
    description: '考研名师，重点突出。',
    url: 'https://www.bilibili.com/video/BV1GJ411x7h7'
  },
  {
    title: 'StatLect',
    description: '免费的概率统计在线教材。',
    url: 'https://www.statlect.com/'
  }
])

const differentialResources = ref([
  {
    title: 'Paul\'s Notes',
    description: '包含常微分方程与偏微分方程的详细解法手册。',
    url: 'https://tutorial.math.lamar.edu/Classes/DE/DE.aspx'
  },
  {
    title: '张宇微分方程',
    description: '考研名师，系统讲解微分方程。',
    url: 'https://www.bilibili.com/video/BV1GJ411x7h7'
  },
  {
    title: '汤家凤微分方程',
    description: '考研名师，适合基础薄弱者。',
    url: 'https://www.bilibili.com/video/BV1GJ411x7h7'
  },
  {
    title: '武忠祥微分方程',
    description: '考研名师，讲解细致。',
    url: 'https://www.bilibili.com/video/BV1GJ411x7h7'
  },
  {
    title: 'Wolfram微分方程',
    description: '提供微分方程求解器和示例。',
    url: 'https://www.wolframalpha.com/examples/differential-equations/'
  }
])

const modelingResources = ref([
  {
    title: 'COMAP 官网',
    description: '美国大学生数学建模竞赛官方资源平台。',
    url: 'https://www.comap.com/'
  },
  {
    title: '数学建模资源库',
    description: '包含历年优秀论文和建模方法。',
    url: 'https://www.mathmodels.org/'
  },
  {
    title: '姜启源数学建模',
    description: '数学建模经典教材作者讲解。',
    url: 'https://www.bilibili.com/video/BV1GJ411x7h7'
  },
  {
    title: '数学建模竞赛培训',
    description: '系统讲解数学建模竞赛技巧。',
    url: 'https://www.bilibili.com/video/BV1GJ411x7h7'
  },
  {
    title: '建模软件工具',
    description: '常用数学建模软件介绍和使用教程。',
    url: 'https://www.mathmodels.org/software/'
  }
])

const advancedMathResources = ref([
  {
    title: '复分析导论',
    description: '深入理解复数函数理论与应用。',
    url: 'https://ocw.mit.edu/courses/18-04-complex-variables-with-applications-spring-2018/'
  },
  {
    title: '实分析基础',
    description: '严格的数学分析理论基础。',
    url: 'https://ocw.mit.edu/courses/18-100c-real-analysis-fall-2012/'
  },
  {
    title: '泛函分析',
    description: '无限维空间的数学理论。',
    url: 'https://ocw.mit.edu/courses/18-102-introduction-to-functional-analysis-spring-2021/'
  },
  {
    title: '拓扑学导论',
    description: '空间的连续性质研究。',
    url: 'https://ocw.mit.edu/courses/18-901-introduction-to-topology-fall-2004/'
  }
])

const toolsResources = ref([
  {
    title: 'WolframAlpha',
    description: '强大的数学计算引擎和求解器。',
    url: 'https://www.wolframalpha.com/'
  },
  {
    title: 'Desmos图形计算器',
    description: '在线图形计算器，可视化数学函数。',
    url: 'https://www.desmos.com/calculator'
  },
  {
    title: 'GeoGebra',
    description: '动态数学软件，支持几何、代数、统计。',
    url: 'https://www.geogebra.org/'
  },
  {
    title: 'Maple',
    description: '专业数学计算软件，符号计算功能强大。',
    url: 'https://www.maplesoft.com/products/maple/'
  },
  {
    title: 'Mathematica',
    description: '综合性技术计算平台。',
    url: 'https://www.wolfram.com/mathematica/'
  },
  {
    title: 'MATLAB',
    description: '数值计算和工程应用平台。',
    url: 'https://www.mathworks.com/products/matlab.html'
  }
])

// 计算收藏列表
const favoritesList = computed(() => {
  return favorites.value.map(fav => {
    // 从所有资源中查找匹配的项目
    const allResources = [
      ...calculusResources.value,
      ...linearAlgebraResources.value,
      ...statisticsResources.value,
      ...differentialResources.value,
      ...modelingResources.value,
      ...advancedMathResources.value,
      ...toolsResources.value
    ]
    const resource = allResources.find(r => r.url === fav.url)
    return resource ? { ...resource } : { title: fav.title, url: fav.url, description: '已收藏的资源' }
  })
})

// Toast提示功能
const showToast = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
  if (type === 'success') {
    ElMessage.success(message)
  } else if (type === 'warning') {
    ElMessage.warning(message)
  } else {
    ElMessage.error(message)
  }
}

// 访问历史记录功能
const HISTORY_KEY = 'navigator_history'
const visitHistory = ref<Array<{title: string, description: string, link: string, timestamp: string}>>([])

const addToHistory = (title: string, description: string, link: string) => {
  const historyItem = {
    title,
    description,
    link,
    timestamp: new Date().toISOString()
  }
  
  visitHistory.value.unshift(historyItem)
  if (visitHistory.value.length > 20) {
    visitHistory.value.pop()
  }
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(visitHistory.value))
}

const loadHistory = () => {
  const stored = localStorage.getItem(HISTORY_KEY)
  if (stored) {
    try {
      visitHistory.value = JSON.parse(stored)
    } catch (error) {
      console.error('加载历史记录失败:', error)
      visitHistory.value = []
    }
  }
}

// 功能函数
const toggleSearchEngineList = (type: 'main' | 'academic') => {
  showEngineList[type] = !showEngineList[type]
  
  // 关闭另一个引擎列表
  if (type === 'main') {
    showEngineList.academic = false
  } else {
    showEngineList.main = false
  }
}

const selectEngine = (type: 'main' | 'academic', engine: any) => {
  selectedEngines[type] = engine
  showEngineList[type] = false
  console.log(`选择${type}搜索引擎:`, engine.name)
}

const doSearch = (type: 'main' | 'academic') => {
  const engine = selectedEngines[type]
  const query = searchQueries[type]
  
  if (!query.trim()) {
    showToast('请输入搜索关键词', 'warning')
    return
  }
  
  console.log(`使用${engine.name}搜索:`, query)
  
  // 记录搜索历史
  addToHistory(`${engine.name}搜索: ${query}`, `使用${engine.name}搜索"${query}"`, engine.url + encodeURIComponent(query))
  
  window.open(engine.url + encodeURIComponent(query), '_blank')
}

// 收藏相关功能
const loadFavorites = () => {
  const stored = localStorage.getItem(FAVORITES_KEY)
  if (stored) {
    try {
      favorites.value = JSON.parse(stored)
    } catch (error) {
      console.error('加载收藏夹失败:', error)
      favorites.value = []
    }
  }
}

const saveFavorites = () => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value))
}

const isFavorited = (url: string) => {
  return favorites.value.some(fav => fav.url === url)
}

const toggleFavorite = (url: string, title: string) => {
  const index = favorites.value.findIndex(fav => fav.url === url)
  if (index === -1) {
    favorites.value.push({ url, title })
    showToast('已添加到收藏夹', 'success')
    
    // 添加到历史记录
    const allResources = [
      ...calculusResources.value,
      ...linearAlgebraResources.value,
      ...statisticsResources.value,
      ...differentialResources.value,
      ...modelingResources.value,
      ...advancedMathResources.value,
      ...toolsResources.value
    ]
    const resource = allResources.find(r => r.url === url)
    if (resource) {
      addToHistory(resource.title, resource.description, url)
    }
  } else {
    favorites.value.splice(index, 1)
    showToast('已从收藏夹移除', 'success')
  }
  saveFavorites()
}

const removeFavorite = (url: string) => {
  const index = favorites.value.findIndex(fav => fav.url === url)
  if (index !== -1) {
    favorites.value.splice(index, 1)
    saveFavorites()
    showToast('已从收藏夹移除', 'success')
  }
}

// 设置弹窗
const showSettingsModal = ref(false)

const openSettingsModal = () => {
  showSettingsModal.value = true
}

const closeSettingsModal = () => {
  showSettingsModal.value = false
}

const updateTheme = (theme: string) => {
  userSettings.theme = theme
  applySettings()
}

const updateFontSize = (fontSize: string) => {
  userSettings.fontSize = fontSize
  applySettings()
}

const updateBackgroundOpacity = (opacity: number) => {
  userSettings.backgroundOpacity = opacity
  applySettings()
}

const updateCardStyle = (cardStyle: string) => {
  userSettings.cardStyle = cardStyle
  applySettings()
}
const loadSettings = () => {
  const stored = localStorage.getItem(SETTINGS_KEY)
  if (stored) {
    try {
      Object.assign(userSettings, JSON.parse(stored))
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }
}

const saveSettings = () => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(userSettings))
}

const applySettings = () => {
  document.documentElement.setAttribute('data-theme', userSettings.theme)
  document.body.style.fontSize = userSettings.fontSize === 'small' ? '14px' : 
                               userSettings.fontSize === 'large' ? '18px' : '16px'
  
  const backgroundElement = document.querySelector('.background') as HTMLElement
  if (backgroundElement) {
    backgroundElement.style.opacity = userSettings.backgroundOpacity.toString()
  }
  
  saveSettings()
}

// 右键菜单相关
const showContextMenu = ref(false)
const contextMenuStyle = ref({
  top: '0px',
  left: '0px'
})
const currentLinkUrl = ref('')

const showContextMenuHandler = (event: MouseEvent, url: string) => {
  event.preventDefault()
  contextMenuStyle.value = {
    top: `${event.clientY}px`,
    left: `${event.clientX}px`
  }
  currentLinkUrl.value = url
  showContextMenu.value = true
}

const copyLink = () => {
  navigator.clipboard.writeText(currentLinkUrl.value)
    .then(() => showToast('链接已复制到剪贴板', 'success'))
    .catch(() => showToast('复制失败，请手动复制', 'error'))
  showContextMenu.value = false
}

const openInNewTab = () => {
  window.open(currentLinkUrl.value, '_blank')
  showContextMenu.value = false
}

// 点击页面其他地方隐藏上下文菜单和搜索引擎列表
const hideContextMenu = () => {
  showContextMenu.value = false
  showEngineList.main = false
  showEngineList.academic = false
}

// 滚动到指定部分
const scrollToSection = (sectionId: string) => {
  if (sectionId === 'favorites') {
    showFavoritesOnly.value = !showFavoritesOnly.value
    return
  }
  
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 页面加载时和卸载时的事件处理
onMounted(() => {
  loadFavorites()
  loadSettings()
  loadHistory()
  applySettings()
  startAutoplay()  // 启动轮播图自动播放
  document.addEventListener('click', hideContextMenu)
  
  // 性能监控
  window.addEventListener('load', () => {
    const timing = window.performance.timing
    if (timing) {
      const loadTime = timing.loadEventEnd - timing.navigationStart
      console.log(`页面加载时间: ${loadTime}ms`)
      
      // 如果页面加载时间过长，显示提示
      if (loadTime > 3000) {
        showToast('页面加载较慢，请检查网络连接', 'warning')
      }
    }
  })
  
  // 全局错误处理
  window.addEventListener('error', (e) => {
    console.error('页面错误:', e.message)
    showToast('页面加载出错，请刷新重试', 'error')
  })
  
  // 未处理的Promise rejection
  window.addEventListener('unhandledrejection', (e) => {
    console.error('未处理的Promise rejection:', e.reason)
    showToast('发生未知错误，请稍后重试', 'error')
    e.preventDefault()
  })
})

onUnmounted(() => {
  pauseAutoplay()  // 停止轮播图自动播放
  document.removeEventListener('click', hideContextMenu)
  
  // 清理事件监听器
  window.removeEventListener('error', () => {})
  window.removeEventListener('unhandledrejection', () => {})
  window.removeEventListener('load', () => {})
})
</script>

<style scoped>
/* 全局样式变量 */
:root {
  --primary-color: #4CAF50;
  --secondary-color: #2196F3;
  --text-color: #333;
  --bg-color: #f5f5f5;
  --card-bg: #fff;
  --border-color: #ddd;
  --hover-color: #f0f0f0;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

/* 容器基础样式 */
.navigator-container {
  position: relative;
  min-height: 100vh;
  background-color: var(--bg-color);
  padding-top: 60px; /* 为固定头部留出空间 */
}

/* 背景 */
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/img/bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.15;
  z-index: -1;
}

/* 添加背景遮罩层 */
.navigator-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  z-index: -1;
}

/* 头部样式 */
/* 旧的导航头部样式已移除，改为使用悬浮面板 */
/* 以下保留移动设备的响应式样式 */
@media (max-width: 768px) {
  .floating-nav-panel {
    width: 180px;
    left: 10px;
    bottom: 10px;
  }
  
  .floating-nav-header .logo span {
    font-size: 14px;
  }
  
  .floating-nav-menu a {
    padding: 6px 10px;
    font-size: 13px;
  }
}

/* 旧的logo样式已移除，使用悬浮面板内的样式 */

/* 旧的导航菜单样式已移除，使用悬浮面板内的样式 */

.favorites-count {
  font-size: 0.8rem;
  color: #409EFF;
  margin-left: 5px;
}

/* 内容区域布局 */
.navigator-content {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 70px; /* 只保留顶部工具栏的间距 */
}

/* 左侧栏 */
.left-bar {
  position: sticky;
  top: 80px;
  width: 240px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 2px 0 20px rgba(0,0,0,0.15);
  border-radius: 8px;
  margin-right: 20px;
  margin-left: 0px;
  align-self: flex-start;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.left-bar .header {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.left-bar .header h1 {
  font-size: 1.2rem;
  margin: 0;
  color: #333;
}

.left-bar .menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.left-bar .menu a {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  text-decoration: none;
  color: #666;
  transition: all 0.3s;
  gap: 8px;
}

.left-bar .menu a:hover {
  background-color: #f5f5f5;
  color: #4a90e2;
}

.scrollcontent {
  max-height: 500px;
  overflow-y: auto;
}

/* 主内容区域 */
.main {
  flex: 1;
}

.content-box {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.15);
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 搜索区域 */
.sousuo {
  margin-bottom: 30px;
}

.dual-search-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
}

.search {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-box {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.search-engine-name {
  background: #f8f9fa;
  border: none;
  padding: 0 15px;
  border-right: 1px solid #ddd;
  display: flex;
  align-items: center;
  cursor: pointer;
  min-width: 140px;
  transition: all 0.3s ease;
  gap: 6px;
}

.search-engine-name:hover {
  background: #e9ecef;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
}

.search-input :deep(.el-input__wrapper) {
  border: none;
  box-shadow: none;
  border-radius: 0;
}

.search-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: #45a049;
}

.search-engine {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 4px;
  margin-top: 5px;
  z-index: 10;
  border: 1px solid #eee;
  max-height: 200px;
  overflow-y: auto;
}

.search-engine-head {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
  font-weight: 500;
  color: #495057;
}

.search-engine-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-engine-list li {
  padding: 12px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f8f9fa;
}

.search-engine-list li:last-child {
  border-bottom: none;
}

.search-engine-list li:hover {
  background: #e3f2fd;
  color: #1976d2;
  padding-left: 20px;
}

/* 学术搜索的特殊样式 */
.academic-search .search-engine-name {
  background: #e8f5e8;
}

.academic-search .search-engine-name:hover {
  background: #d4edda;
}

.academic-search .search-btn {
  background: #28a745;
}

.academic-search .search-btn:hover {
  background: #218838;
}

.academic-search .search-engine-head {
  background: #e8f5e8;
  color: #155724;
}

.academic-search .search-engine-list li:hover {
  background: #d1ecf1;
  color: #0c5460;
}

/* 右键菜单 */
.context-menu {
  position: fixed;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 4px;
  z-index: 9999;
  width: 180px;
}

.context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.context-menu li {
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.context-menu li:hover {
  background: #f5f5f5;
}

/* 轮播图区域 */
.carousel-container {
  margin-bottom: 30px;
}

.carousel {
  position: relative;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.carousel-slides {
  display: flex;
  width: 300%;
  height: 100%;
  transition: transform 0.5s ease;
}

.slide {
  flex: 0 0 33.333%;
  height: 100%;
}

.slide-link {
  display: block;
  height: 100%;
  position: relative;
  text-decoration: none;
  color: white;
  overflow: hidden;
}

.slide-link img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.slide-link:hover img {
  transform: scale(1.05);
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  z-index: 2;
}

.slide-content h2 {
  margin: 0 0 10px;
  font-size: 1.8rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.slide-content p {
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 3;
}

.carousel-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-50%) scale(1.1);
}

.carousel-button.prev {
  left: 15px;
}

.carousel-button.next {
  right: 15px;
}

.carousel-dots {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 3;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: white;
  transform: scale(1.2);
}

.dot:hover {
  background: rgba(255, 255, 255, 0.8);
}

/* 资源卡片区域 */
.item-tit {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.item-tit strong {
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2c3e50;
}

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

.two-list-box {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.resource-card {
  position: relative;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.resource-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  background: rgba(255, 255, 255, 0.95);
}

.card-link {
  display: block;
  padding: 20px;
  text-decoration: none;
  color: #333;
  position: relative;
}

.card-tit {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #333;
}

.card-desc {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 35px; /* 为收藏按钮留出空间 */
}

/* 收藏按钮样式 */
.favorite-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  color: #666;
  transition: all 0.3s;
  z-index: 1;
}

.favorite-btn:hover {
  background: #ffd700;
  border-color: #ffd700;
  color: #333;
  transform: scale(1.1);
}

.favorite-btn.favorited {
  background: #ffd700;
  border-color: #ffd700;
  color: #333;
  animation: pulse 0.3s;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* 固定知识导航栏样式 */
.fixed-knowledge-nav {
  position: fixed;
  left: 20px;
  bottom: 400px;
  width: 220px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fixed-knowledge-nav:hover {
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.fixed-knowledge-header {
  padding: 12px 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  text-align: center;
}

.fixed-knowledge-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.fixed-knowledge-menu ul {
  list-style: none;
  padding: 8px 0;
  margin: 0;
}

.fixed-knowledge-menu li {
  margin: 0;
  padding: 0;
}

.fixed-knowledge-menu a {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
  font-size: 14px;
  gap: 8px;
}

.fixed-knowledge-menu a:hover,
.fixed-knowledge-menu a.active {
  background-color: rgba(26, 23, 219, 0.1);
  color: #1a17db;
  border-left: 3px solid #1a17db;
  padding-left: 12px;
}

/* 悬浮导航面板 */
.floating-nav-panel {
  position: fixed;
  left: 20px;
  bottom: 20px;
  width: 220px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.floating-nav-panel:hover {
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.floating-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.floating-nav-header .logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 16px;
}

.floating-nav-header .logo img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.floating-nav-header .nav-btn {
  padding: 4px;
  font-size: 14px;
}

.floating-nav-menu {
  padding: 8px 0;
}

.floating-nav-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.floating-nav-menu li {
  margin: 0;
  padding: 0;
}

.floating-nav-menu a {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
  font-size: 14px;
  gap: 8px;
}

.floating-nav-menu a:hover,
.floating-nav-menu a.active {
  background-color: rgba(26, 23, 219, 0.1);
  color: #1a17db;
}

.floating-nav-menu .favorites-count {
  font-size: 12px;
  color: #666;
  margin-left: 3px;
}

.floating-nav-menu li.active a {
  color: #1a17db;
  font-weight: bold;
}

/* 内容区域响应式调整 */
@media (max-width: 768px) {
  .fixed-knowledge-nav {
    width: 180px;
    bottom: 200px;
  }
  
  .navigator-content {
    flex-direction: column;
  }
  
  .dual-search-container {
    flex-direction: column;
  }
  
  .search {
    width: 100%;
  }
  
  .navigator-header .main {
    padding: 0.3rem 1rem;
  }
  
  .logo span {
    font-size: 1.2rem;
  }
  
  .nav ul {
    gap: 1rem;
  }
  
  .carousel-button {
    width: 35px;
    height: 35px;
  }
  
  .carousel-button.prev {
    left: 10px;
  }
  
  .carousel-button.next {
    right: 10px;
  }
}

/* 侧边栏切换效果 */
@media (max-width: 480px) {
  .fixed-knowledge-nav {
    width: 160px;
    bottom: 180px;
    left: 10px;
  }
  
  .fixed-knowledge-header h3 {
    font-size: 14px;
  }
  
  .fixed-knowledge-menu a {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .floating-nav-panel {
    width: 160px;
    left: 10px;
    bottom: 10px;
  }
  
  .floating-nav-header .logo span {
    font-size: 14px;
  }
  
  .floating-nav-menu a {
    padding: 6px 10px;
    font-size: 13px;
  }
}

/* 侧边栏切换效果 */
.programming-view {
  padding: 20px;
  min-height: 500px;
}

.programming-title {
  font-size: 2rem;
  color: #303133;
  margin-bottom: 15px;
  text-align: center;
}

.programming-description {
  color: #606266;
  text-align: center;
  margin-bottom: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.category-cards {
  margin-top: 30px;
}

.material-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.3s;
  height: 230px;
  display: flex;
  flex-direction: column;
}

.material-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
  margin-bottom: 15px;
  padding-top: 20px;
}

.card-header h3 {
  margin: 10px 0 0 0;
  color: #303133;
  font-size: 1.3rem;
}

.card-description {
  color: #606266;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
  padding: 0 15px;
  flex-grow: 1;
}

.card-stats {
  text-align: center;
  color: #909399;
  font-size: 12px;
  margin-bottom: 15px;
}
</style>
