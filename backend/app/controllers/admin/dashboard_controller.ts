import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import Order from '#models/order'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'

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

      const stats = {
        totalProducts: Number(totalProducts[0].$extras.total),
        activeProducts: Number(activeProducts[0].$extras.total),
        totalOrders: Number(totalOrders[0].$extras.total),
        pendingOrders: Number(pendingOrders[0].$extras.total),
        monthlyRevenue: Number(monthlyRevenue[0].$extras.total) || 0
      }

      logger.info(`[Admin Dashboard] Stats: ${stats.totalProducts} produits, ${stats.totalOrders} commandes, CA: ${stats.monthlyRevenue}€`)

      return response.ok({
        data: {
          stats,
          recentOrders: recentOrders
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
