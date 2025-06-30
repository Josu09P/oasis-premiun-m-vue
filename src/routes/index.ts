// routes.ts
import { useUserStore } from '@/stores/user'
import Swal from 'sweetalert2'
import { createWebHistory, createRouter } from 'vue-router'


const routes = [
  {
    path: '/',
    redirect: '/client/home'
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
    path: '/admin/',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/presentation/pages/admin/dashboard.vue'),

      },
      // CATEGORIAS
      {
        path: 'categories',
        component: () => import('@/presentation/pages/admin/categories/AccessDirectCategories.vue')
      },
      {
        path: 'categories/list',
        component: () => import('@/presentation/pages/admin/categories/ListCategories.vue')
      },
      {
        path: 'categories/create',
        component: () => import('@/presentation/pages/admin/categories/CreateCategories.vue')
      },
      {
        path: 'categories/update/:id',
        component: () => import('@/presentation/pages/admin/categories/UpdateCategories.vue')
      },
      //PRODUCTOS
      {
        path: 'products',
        component: () => import('@/presentation/pages/admin/products/AccessDirectProducts.vue')
      },
      {
        path: 'products/list',
        component: () => import('@/presentation/pages/admin/products/ListProducts.vue')
      },
      {
        path: 'products/create',
        component: () => import('@/presentation/pages/admin/products/CreateProducts.vue')
      },
      {
        path: 'products/update/:id',
        component: () => import('@/presentation/pages/admin/products/UpdateProducts.vue')
      },
      //CARRUSELES
      {
        path: 'carousel',
        component: () => import('@/presentation/pages/admin/carousels/AccessDirectCarousel.vue')
      },
      {
        path: 'carousel/list',
        component: () => import('@/presentation/pages/admin/carousels/ListCarousel.vue')
      },
      {
        path: 'carousel/create',
        component: () => import('@/presentation/pages/admin/carousels/CreateCarousel.vue')
      },
      {
        path: 'carousel/update/:id',
        component: () => import('@/presentation/pages/admin/carousels/UpdateCarousel.vue')
      },
      // DESCUENTOS
      {
        path: 'discount',
        component: () => import('@/presentation/pages/admin/discounts/AccessDirectDiscount.vue')
      },
      {
        path: 'discount/list',
        component: () => import('@/presentation/pages/admin/discounts/ListDiscount.vue')
      },
      {
        path: 'discount/create',
        component: () => import('@/presentation/pages/admin/discounts/CreateDiscount.vue')
      },
      {
        path: 'discount/update/:id',
        component: () => import('@/presentation/pages/admin/discounts/UpdateDiscount.vue')
      },
      //STOCK
      {
        path: 'stock',
        component: () => import('@/presentation/pages/admin/stock/AccessDirectStock.vue')
      },
      {
        path: 'stock/list',
        component: () => import('@/presentation/pages/admin/stock/ListStock.vue')
      },
      {
        path: 'stock/create',
        component: () => import('@/presentation/pages/admin/stock/CreateStock.vue')
      },
      {
        path: 'stock/update/:id',
        component: () => import('@/presentation/pages/admin/stock/UpdateStock.vue')
      },
    ]
  },
  {
    path: '/client/',
    children: [
      {
        path: 'home',
        component: () => import('@/presentation/pages/client/HomePage.vue')
      },
            {
        path: 'clima',
        component: () => import('@/presentation/pages/client/ClimaPage.vue')
      },
      {
        path: 'products',
        component: () => import('@/presentation/pages/client/products/ViewProducts.vue')
      },      
     /* {
        path: 'products',
        component: () => import('@/presentation/pages/client/ProductsPage.vue')
      },
      {
        path: 'discount',
        component: () => import('@/presentation/pages/client/DiscountPage.vue')
      },
      {
        path: 'contact',
        component: () => import('@/presentation/pages/client/ContactPage.vue')
      }, */
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
  const now = Date.now()
  const MAX_SESSION_TIME = 6 * 60 * 60 * 1000
  const loginTime = store.loginTime || 0
  const isSessionExpired = now - loginTime > MAX_SESSION_TIME

  if (isSessionExpired && isLoggedIn) {
    store.logout()
    Swal.fire('Sesión expirada', 'Por favor inicia sesión nuevamente.', 'warning')
    return next('/auth/login')
  }

  const allowedRoles = ['ADMIN', 'SUPER_ADMIN']
  if (to.path.startsWith('/admin') && (!isLoggedIn || !allowedRoles.includes(store.role))) {

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

