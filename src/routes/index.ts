// routes.ts
import { useUserStore } from '@/stores/user'
import { createWebHistory, createRouter } from 'vue-router'


const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('@/presentation/pages/client/HomePage.vue')
  },
  {
    path: '/auth',
    children: [
      {
        path: 'register',
        component: () => import('@/presentation/pages/auth/RegisterPage.vue')
      },
      {
        path: 'login',
        component: () => import('@/presentation/pages/auth/LoginPage.vue')
      }
    ]
  },
  {
    path: '/admin/dashboard',
    children: [
      {
         path:'',
         component: () => import('@/presentation/pages/admin/dashboard.vue'),
    
      },
      {
        path: 'categories',
        component: () => import('@/presentation/pages/admin/categories/AccessDirectCategories.vue') 
      }
    ]
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

/* 
 - Protección de rutas privadas
 - Bloquear acceso a /auth/login si el usuario ya está logueado
*/
router.beforeEach((to, _from, next) => {
  const store = useUserStore()
  const isLoggedIn = !!store.id

  if (to.path.startsWith('/admin') && (!isLoggedIn || store.role !== 'ADMIN')) {
    return next('/auth/login')
  }

  if (to.path.startsWith('/client') && (!isLoggedIn || store.role !== 'CLIENT')) {
    return next('/auth/login')
  }

  if (to.path.startsWith('/auth') && isLoggedIn) {
    return next(store.route || '/')
  }

  next()
})
