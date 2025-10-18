import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import logger from '@adonisjs/core/services/logger'
import { ORDER_STATUS_ARRAY, ORDER_STATUS } from '#core/enums/order_status'
import mail from '@adonisjs/mail/services/main'
import OrderPaymentConfirmed from '#mails/order_payment_confirmed'
import OrderReadyNotification from '#mails/order_ready_notification'
import OrderAvailableNotification from '#mails/order_available_notification'

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
      const oldStatus = order.status

      logger.info(`[Admin Orders] Changement statut commande ${order.orderNumber}: ${oldStatus} → ${status}`)

      // Valider le statut
      if (!ORDER_STATUS_ARRAY.includes(status)) {
        logger.warn(`[Admin Orders] Statut invalide: ${status}`)
        return response.badRequest({
          message: 'Invalid status value'
        })
      }

      order.status = status
      await order.save()
      logger.info(`[Admin Orders] Statut mis à jour avec succès`)

      // Précharger les relations nécessaires pour les emails
      await order.load('orderItems', (query) => {
        query.preload('product')
      })

      let emailSent = false

      // Détecter la transition pending_payment → paid pour envoyer l'email de confirmation
      if (oldStatus === ORDER_STATUS.PENDING_PAYMENT && status === ORDER_STATUS.PAID) {
        try {
          await this.sendPaymentConfirmationEmail(order)
          emailSent = true
        } catch (error) {
          logger.error(`[Admin Orders] Erreur envoi email confirmation paiement pour ${order.orderNumber}: ${error.message}`)
        }
      }

      // Détecter la transition vers ready pour notifier que la commande est prête
      if (status === ORDER_STATUS.READY) {
        try {
          await this.sendOrderReadyEmail(order)
          emailSent = true
        } catch (error) {
          logger.error(`[Admin Orders] Erreur envoi email commande prête pour ${order.orderNumber}: ${error.message}`)
        }
      }

      // Détecter la transition vers available pour notifier que la commande est disponible
      if (status === ORDER_STATUS.AVAILABLE) {
        try {
          await this.sendOrderAvailableEmail(order)
          emailSent = true
        } catch (error) {
          logger.error(`[Admin Orders] Erreur envoi email commande disponible pour ${order.orderNumber}: ${error.message}`)
        }
      }

      return response.ok({
        data: order,
        message: 'Order status updated successfully',
        emailSent
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

  /**
   * Send payment confirmation email to customer
   */
  private async sendPaymentConfirmationEmail(order: Order): Promise<void> {
    try {
      logger.info(`[Admin Orders] Envoi email confirmation paiement: ${order.customerEmail}`)
      await mail.send(new OrderPaymentConfirmed(order))
      logger.info(`[Admin Orders] Email confirmation paiement envoyé avec succès pour ${order.orderNumber}`)
    } catch (error) {
      logger.error(`[Admin Orders] Erreur lors de l'envoi de l'email de confirmation: ${error.message}`)
      logger.error(`[Admin Orders] Détails erreur:`, error)
      throw error
    }
  }

  /**
   * Send order ready notification email to customer
   */
  private async sendOrderReadyEmail(order: Order): Promise<void> {
    try {
      logger.info(`[Admin Orders] Envoi email commande prête: ${order.customerEmail}`)
      await mail.send(new OrderReadyNotification(order))
      logger.info(`[Admin Orders] Email commande prête envoyé avec succès pour ${order.orderNumber}`)
    } catch (error) {
      logger.error(`[Admin Orders] Erreur lors de l'envoi de l'email commande prête: ${error.message}`)
      logger.error(`[Admin Orders] Détails erreur:`, error)
      throw error
    }
  }

  /**
   * Send order available notification email to customer
   */
  private async sendOrderAvailableEmail(order: Order): Promise<void> {
    try {
      logger.info(`[Admin Orders] Envoi email commande disponible: ${order.customerEmail}`)
      await mail.send(new OrderAvailableNotification(order))
      logger.info(`[Admin Orders] Email commande disponible envoyé avec succès pour ${order.orderNumber}`)
    } catch (error) {
      logger.error(`[Admin Orders] Erreur lors de l'envoi de l'email commande disponible: ${error.message}`)
      logger.error(`[Admin Orders] Détails erreur:`, error)
      throw error
    }
  }
}
