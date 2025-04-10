import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' 
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import MenuManagement from '@/views/admin/MenuManagement.vue'
import OrderManagement from '@/views/admin/OrderManagement.vue'
import TableManagement from '@/views/admin/TableManagement.vue'
import UserManagement from '@/views/admin/UserManagement.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/menu',
    name: 'menu',
    component: () => import('@/views/MenuView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/CartView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/OrdersView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  // Admin routes
  {
    path: '/admin',
    component: AdminDashboard,
    children: [
      {
        path: 'menu',
        name: 'MenuManagement',
        component: MenuManagement,
      },
      {
        path: 'orders',
        name: 'OrderManagement',
        component: OrderManagement,
      },
      {
        path: 'tables',
        name: 'TableManagement',
        component: TableManagement,
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagement,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state if not already done
  if (!authStore.isInitialized) {
    await authStore.init()
    authStore.isInitialized = true
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // Check if route is for guests only
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: 'home' })
  }

  // Check if route requires admin privileges
  if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    return next({ name: 'home' })
  }

  next()
})

export default router