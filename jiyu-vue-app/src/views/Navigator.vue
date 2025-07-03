<!-- 
  Navigator.vue
  学习资料导航页组件，移植自原生H5页面Navigator.html
-->
<template>
  <div class="navigator-container">
    <!-- 背景图片 -->
    <div class="background"></div>

    <!-- 网站头部 -->
    <header class="navigator-header">
      <div class="main">
        <!-- 菜单切换按钮 -->
        <el-button 
          class="nav-btn" 
          icon="Menu" 
          @click="toggleSidebar"
        />

        <h1 class="logo">
          <router-link to="/materials">
            <img src="@/assets/logo.svg" alt="logo">
            <span>学习资料</span>
          </router-link>
        </h1>

        <!-- 右键菜单（由Vue控制，取代原生右键菜单） -->
        <div 
          v-show="showContextMenu" 
          class="context-menu" 
          :style="contextMenuStyle"
        >
          <ul>
            <li @click="copyLink"><el-icon><DocumentCopy /></el-icon>复制链接</li>
            <li @click="openInNewTab"><el-icon><Link /></el-icon>在新标签页打开</li>
          </ul>
        </div>

        <!-- 导航菜单 -->
        <nav class="nav">
          <ul>
            <li>
              <router-link to="/dashboard" active-class="active">
                <el-icon><House /></el-icon> 首页
              </router-link>
            </li>
            <li id="favorites-btn">
              <a href="#favorites" @click="scrollToSection('favorites')">
                <el-icon><Star /></el-icon> 收藏
              </a>
            </li>
            <li id="settings-btn">
              <a href="#settings" @click="scrollToSection('settings')">
                <el-icon><Setting /></el-icon> 设置
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <div id="content" class="navigator-content">
      <!-- 左侧栏 -->
      <div class="left-bar">
        <div class="header">
          <h1>知识导航</h1>
        </div>
        <div class="menu" id="menu">
          <ul class="scrollcontent">
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

      <!-- 主内容 -->
      <div class="main">
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
            <el-carousel class="carousel" height="300px" indicator-position="outside">
              <!-- 第一张：高等数学 -->
              <el-carousel-item>
                <a 
                  href="https://www.bilibili.com/video/BV1Eb411u7Fw" 
                  target="_blank" 
                  class="slide-link"
                  @contextmenu.prevent="showContextMenuHandler($event, 'https://www.bilibili.com/video/BV1Eb411u7Fw')"
                >
                  <div class="slide-content">
                    <h2>宋浩高等数学</h2>
                    <p>点击观看B站完整教学视频课程</p>
                  </div>
                </a>
              </el-carousel-item>
          
              <!-- 第二张：数学建模 -->
              <el-carousel-item>
                <a 
                  href="https://dxs.moe.gov.cn/zx/hd/sxjm/dxsx/dxsxmnsj/" 
                  target="_blank" 
                  class="slide-link"
                  @contextmenu.prevent="showContextMenuHandler($event, 'https://dxs.moe.gov.cn/zx/hd/sxjm/dxsx/dxsxmnsj/')"
                >
                  <div class="slide-content">
                    <h2>全国数学建模竞赛</h2>
                    <p>官方赛事信息与历年优秀作品</p>
                  </div>
                </a>
              </el-carousel-item>
          
              <!-- 第三张：考研数学 -->
              <el-carousel-item>
                <a 
                  href="https://kmath.cn/math/" 
                  target="_blank" 
                  class="slide-link"
                  @contextmenu.prevent="showContextMenuHandler($event, 'https://kmath.cn/math/')"
                >
                  <div class="slide-content">
                    <h2>考研数学宝典</h2>
                    <p>历年真题解析与专题训练</p>
                  </div>
                </a>
              </el-carousel-item>
            </el-carousel>
          </section>

          <!-- 微积分 -->
          <section class="item card-box" id="row-1">
            <div class="container-fluid">
              <div class="row">
                <div class="item-tit">
                  <strong><el-icon><Edit /></el-icon> 微积分</strong>
                </div>
                <div class="clearfix two-list-box">
                  <div class="resource-card">
                    <a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/"
                        class="card-link" target="_blank">
                      <div class="card-tit">MIT微积分课程</div>
                      <div class="card-desc">MIT开放式课程，包含完整教学视频、讲义和习题。</div>
                    </a>
                  </div>
                  <div class="resource-card">
                    <a href="https://www.khanacademy.org/math/calculus-1" class="card-link"
                        target="_blank">
                      <div class="card-tit">可汗学院</div>
                      <div class="card-desc">从极限到积分完整知识体系，配套交互练习。</div>
                    </a>
                  </div>
                  <div class="resource-card">
                    <a href="https://www.bilibili.com/video/BV1Eb411u7Fw" class="card-link" target="_blank">
                      <div class="card-tit">宋浩高等数学</div>
                      <div class="card-desc">B站知名数学教师，讲解深入浅出。</div>
                    </a>
                  </div>
                  <div class="resource-card">
                    <a href="https://www.bilibili.com/video/BV1GJ411x7h7" class="card-link" target="_blank">
                      <div class="card-tit">张宇高等数学</div>
                      <div class="card-desc">考研名师，系统讲解高等数学。</div>
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
                  <div class="resource-card">
                    <a href="https://www.bilibili.com/video/BV1aW411Q7x1" class="card-link" target="_blank">
                      <div class="card-tit">线性代数的本质</div>
                      <div class="card-desc">3Blue1Brown出品，图形化理解线性代数概念。</div>
                    </a>
                  </div>
                  <div class="resource-card">
                    <a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" class="card-link" target="_blank">
                      <div class="card-tit">MIT线性代数课程</div>
                      <div class="card-desc">Gilbert Strang教授授课，全球知名线性代数课程。</div>
                    </a>
                  </div>
                  <div class="resource-card">
                    <a href="https://www.bilibili.com/video/BV1aW411Q7x1" class="card-link" target="_blank">
                      <div class="card-tit">李永乐线性代数</div>
                      <div class="card-desc">考研数学名师，讲解清晰详细。</div>
                    </a>
                  </div>
                  <div class="resource-card">
                    <a href="https://immersivemath.com/ila/index.html" class="card-link" target="_blank">
                      <div class="card-tit">交互式线性代数</div>
                      <div class="card-desc">可视化、交互式的线性代数电子教材。</div>
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
                  <div class="resource-card">
                    <a href="https://www.khanacademy.org/math/statistics-probability" class="card-link" target="_blank">
                      <div class="card-tit">可汗学院概率统计</div>
                      <div class="card-desc">覆盖基础概率到高级统计学，提供丰富练习。</div>
                    </a>
                  </div>
                  <div class="resource-card">
                    <a href="https://seeing-theory.brown.edu/" class="card-link" target="_blank">
                      <div class="card-tit">可视化概率论</div>
                      <div class="card-desc">布朗大学开发的交互式概率统计可视化平台。</div>
                    </a>
                  </div>
                  <div class="resource-card">
                    <a href="https://www.bilibili.com/video/BV1ot411y7mU" class="card-link" target="_blank">
                      <div class="card-tit">陈华伟概率统计</div>
                      <div class="card-desc">浙大教授，讲解精准到位。</div>
                    </a>
                  </div>
                  <div class="resource-card">
                    <a href="https://www.statlearning.com/" class="card-link" target="_blank">
                      <div class="card-tit">统计学习导论</div>
                      <div class="card-desc">经典统计学习教材，提供免费电子版。</div>
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
                  <strong><el-icon><DataAnalysis /></el-icon> 微分方程</strong>
                </div>
                <div class="clearfix two-list-box">
                  <div class="resource-card">
                    <a href="https://www.bilibili.com/video/BV1PD4y1D7nx" class="card-link" target="_blank">
                      <div class="card-tit">常微分方程教程</div>
                      <div class="card-desc">通俗易懂的微分方程入门教程。</div>
                    </a>
                  </div>
                  <div class="resource-card">
                    <a href="https://www.bilibili.com/video/BV1Q7411W7bR" class="card-link" target="_blank">
                      <div class="card-tit">3Blue1Brown微分方程</div>
                      <div class="card-desc">通过可视化理解微分方程的几何意义。</div>
                    </a>
                  </div>
                  <div class="resource-card">
                    <a href="https://tutorial.math.lamar.edu/Classes/DE/DE.aspx" class="card-link" target="_blank">
                      <div class="card-tit">Paul's Online Notes</div>
                      <div class="card-desc">丰富的微分方程笔记和例题解析。</div>
                    </a>
                  </div>
                  <div class="resource-card">
                    <a href="https://ocw.mit.edu/courses/18-03-differential-equations-spring-2010/" class="card-link" target="_blank">
                      <div class="card-tit">MIT微分方程课程</div>
                      <div class="card-desc">完整的微分方程课程，含视频和习题。</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 更多资源部分可以根据需要继续添加 -->
        </div>
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <el-backtop :right="20" :bottom="20" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  House, Search, Link, DocumentCopy, 
  Star, Setting, Tools, Menu, Edit,
  Clock, DataAnalysis, Collection
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 侧边栏状态
const sidebarVisible = ref(false)
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

// 搜索引擎相关
const searchEngines = reactive({
  main: [
    { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=' },
    { id: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd=' },
    { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=' },
    { id: 'sogou', name: '搜狗', url: 'https://www.sogou.com/web?query=' }
  ],
  academic: [
    { id: 'scholar', name: 'Google Scholar', url: 'https://scholar.google.com/scholar?q=' },
    { id: 'cnki', name: 'CNKI', url: 'https://kns.cnki.net/kns8/defaultresult/index?kw=' },
    { id: 'wanfang', name: '万方', url: 'https://s.wanfangdata.com.cn/paper?q=' },
    { id: 'scihub', name: 'Sci-Hub', url: 'https://sci-hub.se/' }
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
}

const doSearch = (type: 'main' | 'academic') => {
  const engine = selectedEngines[type]
  const query = searchQueries[type]
  
  if (!query.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  window.open(engine.url + encodeURIComponent(query), '_blank')
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
    .then(() => ElMessage.success('链接已复制到剪贴板'))
    .catch(() => ElMessage.error('复制失败，请手动复制'))
  showContextMenu.value = false
}

const openInNewTab = () => {
  window.open(currentLinkUrl.value, '_blank')
  showContextMenu.value = false
}

// 点击页面其他地方隐藏上下文菜单
const hideContextMenu = () => {
  showContextMenu.value = false
  showEngineList.main = false
  showEngineList.academic = false
}

// 滚动到指定部分
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 页面加载时和卸载时的事件处理
onMounted(() => {
  document.addEventListener('click', hideContextMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', hideContextMenu)
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
  background-image: linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%);
  opacity: 0.3;
  z-index: -1;
}

/* 头部样式 */
.navigator-header {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.navigator-header .main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
}

.logo img {
  width: 40px;
  height: auto;
  margin-right: 10px;
}
.logo span {
  font-size: 1.5rem;
  font-weight: bold;
}

/* 导航菜单 */
.nav {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.nav ul {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav a {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.nav a:hover,
.nav a.active {
  color: #4a90e2;
}

/* 内容区域布局 */
.navigator-content {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* 左侧栏 */
.left-bar {
  position: sticky;
  top: 80px;
  width: 240px;
  background: #fff;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  border-radius: 8px;
  margin-right: 20px;
  align-self: flex-start;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
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
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px;
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
}

.search-engine-name {
  background: #f5f5f5;
  border: none;
  padding: 0 15px;
  border-right: 1px solid #ddd;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
}

.search-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0 20px;
  cursor: pointer;
}

.search-engine {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-radius: 4px;
  margin-top: 5px;
  z-index: 10;
  border: 1px solid #eee;
}

.search-engine-head {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

.search-engine-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-engine-list li {
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.3s;
}

.search-engine-list li:hover {
  background: #f5f5f5;
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
  border-radius: 8px;
  overflow: hidden;
}

.slide-link {
  display: block;
  height: 100%;
  position: relative;
  text-decoration: none;
  color: white;
  background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6));
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
}

.slide-content h2 {
  margin: 0 0 10px;
  font-size: 1.8rem;
}

.slide-content p {
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
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
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
}

.card-link {
  display: block;
  padding: 20px;
  text-decoration: none;
  color: #333;
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
}

/* 响应式调整 */
@media (max-width: 768px) {
  .navigator-content {
    flex-direction: column;
  }
  
  .left-bar {
    width: 100%;
    position: static;
    margin-bottom: 20px;
    margin-right: 0;
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
}
</style>
