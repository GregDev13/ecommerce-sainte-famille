/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// API Health Check - Route racine
router.get('/', async () => {
  return {
    message: 'Marché de Noël la Sainte Famille API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  }
})

// Health check pour Docker healthcheck
router.get('/health', async () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString()
  }
})

// API Routes
router.group(() => {
  // Products
  router.get('/products', '#controllers/products_controller.index')
  router.get('/products/:id', '#controllers/products_controller.show')
  router.get('/products/:id/related', '#controllers/products_controller.related')
  router.post('/products/:id/view', '#controllers/products_controller.trackView')

  // Orders (public - guest checkout)
  router.post('/orders', '#controllers/orders_controller.store')
  router.get('/orders/:orderNumber', '#controllers/orders_controller.show')

  // Payment instructions
  router.get('/payment-instructions/:method', '#controllers/payment_instructions_controller.show')

  // Admin Routes
  router.group(() => {
    // Auth
    router.post('/login', '#controllers/admin/auth_controller.login')

    // Protected admin routes
    router.group(() => {
      router.post('/logout', '#controllers/admin/auth_controller.logout')
      router.get('/me', '#controllers/admin/auth_controller.me')

      // Dashboard
      router.get('/dashboard', '#controllers/admin/dashboard_controller.index')

      // Products management
      router.get('/products', '#controllers/admin/products_controller.index')
      router.get('/products/views-stats', '#controllers/admin/products_controller.getViewsStats')
      router.get('/products/:id', '#controllers/admin/products_controller.show')
      router.post('/products', '#controllers/admin/products_controller.store')
      router.put('/products/:id', '#controllers/admin/products_controller.update')
      router.delete('/products/:id', '#controllers/admin/products_controller.destroy')
      router.patch('/products/:id/toggle', '#controllers/admin/products_controller.toggleActive')

      // Orders management
      router.get('/orders', '#controllers/admin/orders_controller.index')
      router.get('/orders/:id', '#controllers/admin/orders_controller.show')
      router.patch('/orders/:id/status', '#controllers/admin/orders_controller.updateStatus')
      router.delete('/orders/:id', '#controllers/admin/orders_controller.destroy')
    }).use(middleware.auth()).use(middleware.admin())
  }).prefix('/admin')

}).prefix('/api/v1')
