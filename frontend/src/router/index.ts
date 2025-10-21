import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProductsView from '@/views/ProductsView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue'),
    },
    {
      path: '/order-confirmation/:orderNumber',
      name: 'order-confirmation',
      component: () => import('@/views/OrderConfirmationView.vue'),
    },

    // Admin routes
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/LoginView.vue'),
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/DashboardView.vue'),
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('@/views/admin/ProductsListView.vue'),
        },
        {
          path: 'products/new',
          name: 'admin-products-new',
          component: () => import('@/views/admin/ProductFormView.vue'),
        },
        {
          path: 'products/:id/edit',
          name: 'admin-products-edit',
          component: () => import('@/views/admin/ProductFormView.vue'),
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('@/views/admin/OrdersView.vue'),
        },
        {
          path: 'products-stats',
          name: 'admin-products-stats',
          component: () => import('@/views/admin/ProductViewsStatsView.vue'),
        },
      ],
    },
  ],
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Routes qui nécessitent l'authentification
  if (to.meta.requiresAuth) {
    // Vérifier si on a un token
    if (!authStore.token) {
      return next('/admin/login')
    }

    // Vérifier si l'utilisateur est chargé
    if (!authStore.user) {
      const isValid = await authStore.fetchUser()
      if (!isValid) {
        return next('/admin/login')
      }
    }

    // Vérifier que c'est bien un admin
    if (!authStore.isAdmin) {
      return next('/')
    }
  }

  // Si on est authentifié et qu'on va sur /admin/login, rediriger vers dashboard
  if (to.path === '/admin/login' && authStore.isAuthenticated) {
    return next('/admin/dashboard')
  }

  next()
})

export default router
