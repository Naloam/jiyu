import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register', 
      name: 'register',
      component: () => import('../views/Register.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },

    {
      path: '/materials',
      name: 'materials',
      component: () => import('../views/Materials.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/planning',
      name: 'planning',
      component: () => import('../views/Planning.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/daily-practice',
      name: 'daily-practice',
      component: () => import('../views/DailyPractice.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/Chat.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/guidebook',
      name: 'guidebook',
      component: () => import('../views/Guidebook.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/navigator',
      name: 'navigator',
      component: () => import('../views/Navigator.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/correction',
      name: 'correction',
      component: () => import('../views/Correction.vue'),
      meta: { requiresAuth: true }
    }
  ],
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('jiyu_token')
  
  // 开发环境变量，设为true可以绕过登录验证
  const DEV_BYPASS_AUTH = true
  
  console.log('路由守卫检查:', {
    to: to.path,
    from: from.path,
    hasToken: !!token,
    devMode: DEV_BYPASS_AUTH
  })
  
  // 开发模式，绕过认证
  if (DEV_BYPASS_AUTH) {
    console.log('开发模式：绕过认证')
    next()
    return
  }
  
  // 需要认证的路由
  if (to.meta.requiresAuth) {
    if (!token) {
      console.log('无token，跳转到登录页')
      next('/login')
      return
    }
  }
  
  // 已登录用户访问登录页面，重定向到dashboard
  if ((to.path === '/login' || to.path === '/register' || to.path === '/') && token) {
    console.log('已登录用户，跳转到dashboard')
    next('/dashboard')
    return
  }
  
  next()
})

export default router
