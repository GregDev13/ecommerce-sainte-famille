import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import Order from '#models/order'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'
import db from '@adonisjs/lucid/services/db'

export default class DashboardController {
  /**
   * Get dashboard stats
   */
  async index({ response }: HttpContext) {
    try {
      logger.info(`[Admin Dashboard] Chargement des statistiques`)

      // Total produits
      const totalProducts = await Product.query().count('* as total')
      const activeProducts = await Product.query().where('isActive', true).count('* as total')

      // Total commandes
      const totalOrders = await Order.query().count('* as total')
      const pendingOrders = await Order.query().where('status', 'pending_payment').count('* as total')

      // Chiffre d'affaires du mois
      const startOfMonth = DateTime.now().startOf('month')
      const monthlyRevenue = await Order.query()
        .whereIn('status', ['paid', 'preparing', 'ready', 'available'])
        .where('created_at', '>=', startOfMonth.toSQL())
        .sum('total_amount as total')

      // Commandes récentes
      const recentOrders = await Order.query()
        .preload('user')
        .orderBy('createdAt', 'desc')
        .limit(5)

      // Stats de vues de produits
      const totalViewsResult = await db
        .from('product_views')
        .count('* as total')
        .first()
      const totalViews = totalViewsResult ? Number(totalViewsResult.total) : 0

      // Vues ce mois-ci
      const monthlyViewsResult = await db
        .from('product_views')
        .where('viewed_at', '>=', startOfMonth.toSQL())
        .count('* as total')
        .first()
      const monthlyViews = monthlyViewsResult ? Number(monthlyViewsResult.total) : 0

      // Top 5 produits les plus vus
      const topViewedProducts = await db
        .from('product_views')
        .select('product_id')
        .count('* as views_count')
        .groupBy('product_id')
        .orderBy('views_count', 'desc')
        .limit(5)

      // Récupérer les détails des produits les plus vus
      const productIds = topViewedProducts.map((item: any) => item.product_id)
      const topProducts = await Product.query().whereIn('id', productIds)

      const topViewedWithDetails = topViewedProducts.map((item: any) => {
        const product = topProducts.find(p => p.id === item.product_id)
        return {
          product: product ? {
            id: product.id,
            name: product.name,
            image: product.image
          } : null,
          viewsCount: Number(item.views_count)
        }
      }).filter(item => item.product !== null)

      const stats = {
        totalProducts: Number(totalProducts[0].$extras.total),
        activeProducts: Number(activeProducts[0].$extras.total),
        totalOrders: Number(totalOrders[0].$extras.total),
        pendingOrders: Number(pendingOrders[0].$extras.total),
        monthlyRevenue: Number(monthlyRevenue[0].$extras.total) || 0,
        totalViews,
        monthlyViews
      }

      logger.info(`[Admin Dashboard] Stats: ${stats.totalProducts} produits, ${stats.totalOrders} commandes, CA: ${stats.monthlyRevenue}€, ${stats.totalViews} vues`)

      return response.ok({
        data: {
          stats,
          recentOrders: recentOrders,
          topViewedProducts: topViewedWithDetails
        },
        message: 'Dashboard stats retrieved successfully'
      })
    } catch (error) {
      logger.error(`[Admin Dashboard] Erreur chargement stats: ${error.message}`)
      return response.internalServerError({
        message: 'Failed to retrieve dashboard stats',
        error: error.message
      })
    }
  }
}
