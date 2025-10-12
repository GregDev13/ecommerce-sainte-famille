import type { HttpContext } from '@adonisjs/core/http'
import stripeService from '#services/stripe_service'
import Order from '#models/order'
import Product from '#models/product'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'
import OrderConfirmationNotification from '#mails/order_confirmation_notification'
import NewOrderNotification from '#mails/new_order_notification'
import type Stripe from 'stripe'

export default class StripeWebhookController {
  /**
   * Gérer les webhooks Stripe
   */
  async handle({ request, response }: HttpContext) {
    try {
      // Récupérer le payload brut et la signature
      const payload = request.raw()
      const signature = request.header('stripe-signature')

      if (!signature) {
        logger.warn('[Stripe Webhook] Signature manquante')
        return response.badRequest({ message: 'Signature manquante' })
      }

      // Valider la signature du webhook (CRITIQUE pour la sécurité)
      let event: Stripe.Event
      try {
        event = stripeService.constructWebhookEvent(payload!, signature)
      } catch (error) {
        logger.error(`[Stripe Webhook] Signature invalide: ${error.message}`)
        return response.badRequest({ message: 'Signature webhook invalide' })
      }

      logger.info(`[Stripe Webhook] Événement reçu: ${event.type}`)

      // Gérer les différents types d'événements
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
          break

        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
          break

        default:
          logger.info(`[Stripe Webhook] Événement non géré: ${event.type}`)
      }

      return response.ok({ received: true })
    } catch (error) {
      logger.error(`[Stripe Webhook] Erreur traitement: ${error.message}`)
      // Retourner 200 pour éviter que Stripe ne renvoie le webhook
      // mais logger l'erreur pour investigation
      return response.ok({ received: true, error: error.message })
    }
  }

  /**
   * Gérer la complétion d'une session de paiement
   */
  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    try {
      const orderNumber = session.client_reference_id || session.metadata?.orderNumber

      if (!orderNumber) {
        logger.error('[Stripe Webhook] Numéro de commande manquant dans la session')
        return
      }

      logger.info(`[Stripe Webhook] Paiement complété pour commande ${orderNumber}`)

      // Récupérer la commande
      const order = await Order.query()
        .where('orderNumber', orderNumber)
        .preload('orderItems', (query) => {
          query.preload('product')
        })
        .firstOrFail()

      // Vérifier si le paiement n'a pas déjà été traité (idempotence)
      if (order.status === 'paid' || order.status === 'processing') {
        logger.warn(
          `[Stripe Webhook] Commande ${orderNumber} déjà traitée (status: ${order.status})`
        )
        return
      }

      // Mettre à jour le statut de la commande
      order.status = 'paid'
      order.stripePaymentIntentId = session.payment_intent as string
      await order.save()

      logger.info(`[Stripe Webhook] Commande ${orderNumber} marquée comme payée`)

      // Envoyer les emails de confirmation
      try {
        await this.sendOrderEmails(order)
      } catch (emailError) {
        // Ne pas faire échouer le webhook si les emails échouent
        logger.error(
          `[Stripe Webhook] Erreur envoi emails pour ${orderNumber}: ${emailError.message}`
        )
      }
    } catch (error) {
      logger.error(`[Stripe Webhook] Erreur handleCheckoutSessionCompleted: ${error.message}`)
      throw error
    }
  }

  /**
   * Gérer un échec de paiement
   */
  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    try {
      const orderNumber = paymentIntent.metadata?.orderNumber

      if (!orderNumber) {
        logger.error('[Stripe Webhook] Numéro de commande manquant dans le payment intent')
        return
      }

      logger.warn(`[Stripe Webhook] Paiement échoué pour commande ${orderNumber}`)

      // Récupérer la commande
      const order = await Order.query()
        .where('orderNumber', orderNumber)
        .preload('orderItems', (query) => {
          query.preload('product')
        })
        .first()

      if (!order) {
        logger.error(`[Stripe Webhook] Commande ${orderNumber} introuvable`)
        return
      }

      // Remettre le stock en place si le paiement échoue
      for (const orderItem of order.orderItems) {
        const product = await Product.find(orderItem.productId)
        if (product) {
          product.stock += orderItem.quantity
          await product.save()
          logger.info(
            `[Stripe Webhook] Stock restauré pour ${product.name}: ${product.stock - orderItem.quantity} → ${product.stock}`
          )
        }
      }

      // Marquer la commande comme échouée
      order.status = 'failed'
      await order.save()

      logger.info(`[Stripe Webhook] Commande ${orderNumber} marquée comme échouée`)
    } catch (error) {
      logger.error(`[Stripe Webhook] Erreur handlePaymentFailed: ${error.message}`)
      throw error
    }
  }

  /**
   * Envoyer les emails de confirmation (client + admin)
   */
  private async sendOrderEmails(order: Order): Promise<void> {
    try {
      // Email de confirmation au client
      logger.info(`[Stripe Webhook] Envoi email confirmation client: ${order.customerEmail}`)
      await mail.send(new OrderConfirmationNotification(order))
      logger.info(`[Stripe Webhook] Email confirmation client envoyé avec succès`)

      // Email de notification à l'admin
      logger.info(`[Stripe Webhook] Envoi email notification admin`)
      await mail.send(new NewOrderNotification(order))
      logger.info(`[Stripe Webhook] Email notification admin envoyé avec succès`)
    } catch (error) {
      logger.error(`[Stripe Webhook] Erreur lors de l'envoi des emails: ${error.message}`)
      throw error
    }
  }
}
