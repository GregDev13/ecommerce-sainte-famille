import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Product from '#models/product'
import OrderSequence from '#models/order_sequence'
import logger from '@adonisjs/core/services/logger'
import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'
import OrderConfirmationNotification from '#mails/order_confirmation_notification'
import NewOrderNotification from '#mails/new_order_notification'
import { ORDER_STATUS } from '#core/enums/order_status'
import { ORDER_TYPE } from '#core/enums/order_type'
import { PAYMENT_METHOD, type PaymentMethod } from '#core/enums/payment_method'

export default class OrdersController {
  /**
   * Create a new order (guest checkout)
   */
  async store({ request, response }: HttpContext) {
    const trx = await db.transaction()

    try {
      const {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        notes,
        items,
        paymentMethod,
      } = request.only([
        'customerName',
        'customerEmail',
        'customerPhone',
        'shippingAddress',
        'notes',
        'items',
        'paymentMethod',
      ])

      logger.info(`[Orders] Nouvelle commande de ${customerEmail}`)

      // Validation
      if (!customerName || !customerEmail || !customerPhone) {
        return response.badRequest({
          message: 'Les informations client sont obligatoires',
        })
      }

      if (!paymentMethod || !Object.values(PAYMENT_METHOD).includes(paymentMethod)) {
        return response.badRequest({
          message: 'La méthode de paiement est obligatoire et doit être "wero" ou "paypal"',
        })
      }

      if (!items || items.length === 0) {
        return response.badRequest({
          message: 'La commande doit contenir au moins un produit',
        })
      }

      // Vérifier le stock et calculer le total
      let totalAmount = 0
      const orderItemsData = []

      for (const item of items) {
        const product = await Product.findOrFail(item.productId)

        // Vérifier le stock
        if (product.stock < item.quantity) {
          await trx.rollback()
          logger.warn(
            `[Orders] Stock insuffisant pour ${product.name}: demandé ${item.quantity}, disponible ${product.stock}`
          )
          return response.badRequest({
            message: `Stock insuffisant pour le produit "${product.name}"`,
          })
        }

        const unitPrice =
          typeof product.price === 'string' ? parseFloat(product.price) : product.price
        const totalPrice = unitPrice * item.quantity

        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        })

        totalAmount += totalPrice

        // Décrémenter le stock
        product.stock -= item.quantity
        await product.useTransaction(trx).save()
        logger.info(`[Orders] Stock ${product.name}: ${product.stock + item.quantity} → ${product.stock}`)
      }

      // Générer un numéro de commande séquentiel (SF-0001, SF-0002, etc.)
      const orderNumber = await OrderSequence.getNextNumber()

      // Créer la commande
      const order = new Order()
      order.orderNumber = orderNumber
      order.userId = null // Guest checkout
      order.customerName = customerName
      order.customerEmail = customerEmail
      order.customerPhone = customerPhone
      order.shippingAddress = shippingAddress || null
      order.notes = notes || null
      order.totalAmount = totalAmount
      order.status = ORDER_STATUS.PENDING_PAYMENT
      order.type = ORDER_TYPE.ORDER
      order.paymentMethod = paymentMethod as PaymentMethod

      await order.useTransaction(trx).save()
      logger.info(`[Orders] Commande créée: ${orderNumber}`)

      // Créer les items de commande
      for (const itemData of orderItemsData) {
        const orderItem = new OrderItem()
        orderItem.orderId = order.id
        orderItem.productId = itemData.productId
        orderItem.quantity = itemData.quantity
        orderItem.unitPrice = itemData.unitPrice
        orderItem.totalPrice = itemData.totalPrice
        await orderItem.useTransaction(trx).save()
      }

      await trx.commit()
      logger.info(`[Orders] Commande ${orderNumber} finalisée avec succès`)

      // Recharger la commande avec les relations
      await order.load('orderItems', (query) => {
        query.preload('product')
      })

      // Envoyer les emails de manière asynchrone (ne pas bloquer la réponse)
      this.sendOrderEmails(order).catch((error) => {
        logger.error(`[Orders] Erreur envoi emails pour ${orderNumber}: ${error.message}`)
      })

      return response.created({
        data: order,
        message: 'Commande créée avec succès',
      })
    } catch (error) {
      await trx.rollback()
      logger.error(`[Orders] Erreur création commande: ${error.message}`)
      return response.internalServerError({
        message: 'Erreur lors de la création de la commande',
        error: error.message,
      })
    }
  }

  /**
   * Get an order by order number (for guest confirmation)
   */
  async show({ params, response }: HttpContext) {
    try {
      const order = await Order.query()
        .where('orderNumber', params.orderNumber)
        .preload('orderItems', (query) => {
          query.preload('product')
        })
        .firstOrFail()

      return response.ok({
        data: order,
        message: 'Commande récupérée avec succès',
      })
    } catch (error) {
      return response.notFound({
        message: 'Commande introuvable',
      })
    }
  }

  /**
   * Send order confirmation emails (client + admin)
   */
  private async sendOrderEmails(order: Order): Promise<void> {
    try {
      // Email de confirmation au client
      logger.info(`[Orders] Envoi email confirmation client: ${order.customerEmail}`)
      await mail.send(new OrderConfirmationNotification(order))
      logger.info(`[Orders] Email confirmation client envoyé avec succès`)

      // Email de notification à l'admin
      logger.info(`[Orders] Envoi email notification admin`)
      await mail.send(new NewOrderNotification(order))
      logger.info(`[Orders] Email notification admin envoyé avec succès`)
    } catch (error) {
      logger.error(`[Orders] Erreur lors de l'envoi des emails: ${error.message}`)
      logger.error(`[Orders] Détails erreur:`, error)
      throw error
    }
  }
}
