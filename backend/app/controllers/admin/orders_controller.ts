import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import logger from '@adonisjs/core/services/logger'

export default class OrdersController {
  /**
   * Get all orders
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 20)
      const status = request.input('status', '')

      const ordersQuery = Order.query()
        .preload('user')
        .preload('orderItems', (query) => {
          query.preload('product')
        })

      if (status) {
        ordersQuery.where('status', status)
      }

      const orders = await ordersQuery
        .orderBy('createdAt', 'desc')
        .paginate(page, limit)

      return response.ok({
        data: orders.serialize(),
        message: 'Orders retrieved successfully'
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to retrieve orders',
        error: error.message
      })
    }
  }

  /**
   * Get a single order
   */
  async show({ params, response }: HttpContext) {
    try {
      const order = await Order.query()
        .where('id', params.id)
        .preload('user')
        .preload('orderItems', (query) => {
          query.preload('product')
        })
        .firstOrFail()

      return response.ok({
        data: order,
        message: 'Order retrieved successfully'
      })
    } catch (error) {
      return response.notFound({
        message: 'Order not found'
      })
    }
  }

  /**
   * Update order status
   */
  async updateStatus({ params, request, response }: HttpContext) {
    try {
      const order = await Order.findOrFail(params.id)
      const { status } = request.only(['status'])
      logger.info(`[Admin Orders] Changement statut commande ${order.orderNumber}: ${order.status} → ${status}`)

      // Valider le statut
      const validStatuses = ['pending', 'reserved', 'paid', 'shipped', 'delivered', 'cancelled']
      if (!validStatuses.includes(status)) {
        logger.warn(`[Admin Orders] Statut invalide: ${status}`)
        return response.badRequest({
          message: 'Invalid status value'
        })
      }

      order.status = status
      await order.save()
      logger.info(`[Admin Orders] Statut mis à jour avec succès`)

      return response.ok({
        data: order,
        message: 'Order status updated successfully'
      })
    } catch (error) {
      logger.error(`[Admin Orders] Erreur mise à jour statut: ${error.message}`)
      return response.badRequest({
        message: 'Failed to update order status',
        error: error.message
      })
    }
  }

  /**
   * Delete an order
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const order = await Order.findOrFail(params.id)
      logger.info(`[Admin Orders] Suppression commande ${order.orderNumber}`)

      // Supprimer les items de commande associés
      await order.related('orderItems').query().delete()

      // Supprimer la commande
      await order.delete()
      logger.info(`[Admin Orders] Commande supprimée avec succès`)

      return response.ok({
        message: 'Order deleted successfully'
      })
    } catch (error) {
      logger.error(`[Admin Orders] Erreur suppression commande: ${error.message}`)
      return response.badRequest({
        message: 'Failed to delete order',
        error: error.message
      })
    }
  }
}
