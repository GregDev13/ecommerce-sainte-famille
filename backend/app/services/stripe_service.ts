import Stripe from 'stripe'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import type Order from '#models/order'

/**
 * Service pour gérer les paiements Stripe
 */
class StripeService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(env.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-12-18.acacia',
      typescript: true,
    })
  }

  /**
   * Créer une session Stripe Checkout pour une commande
   */
  async createCheckoutSession(order: Order): Promise<{
    sessionId: string
    checkoutUrl: string
  }> {
    try {
      const frontendUrl = env.get('FRONTEND_URL')
      const backendUrl = env.get('APP_URL')

      // Préparer les line items à partir de la commande
      await order.load('orderItems', (query) => {
        query.preload('product')
      })

      const lineItems = order.orderItems.map((item) => {
        // Construire l'URL complète de l'image si elle existe
        let imageUrl: string | undefined
        if (item.product.image?.url) {
          const productImageUrl = item.product.image.url
          // Si l'URL est relative, la rendre absolue
          imageUrl = productImageUrl.startsWith('http')
            ? productImageUrl
            : `${backendUrl}${productImageUrl}`
        }

        const lineItem = {
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.product.name,
              description: item.product.description || undefined,
              images: imageUrl ? [imageUrl] : [],
            },
            unit_amount: Math.round(item.unitPrice * 100), // Stripe utilise les centimes
          },
          quantity: item.quantity,
        }

        logger.info(
          `[Stripe] Line item: ${item.product.name} - ${item.quantity}x ${item.unitPrice}€ - Image: ${imageUrl || 'aucune'}`
        )

        return lineItem
      })

      logger.info(
        `[Stripe] Création session checkout pour commande ${order.orderNumber} avec ${lineItems.length} produit(s)`
      )

      // Créer la session Stripe Checkout
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_number=${order.orderNumber}`,
        cancel_url: `${frontendUrl}/checkout/cancel?order_number=${order.orderNumber}`,
        customer_email: order.customerEmail,
        client_reference_id: order.orderNumber,

        // Recommandé par Stripe : collecter l'adresse de facturation
        billing_address_collection: 'auto',

        // Métadonnées pour traçabilité
        metadata: {
          orderId: order.id.toString(),
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
        },

        // Adresse de livraison (optionnel, déjà collectée dans le formulaire)
        // shipping_address_collection: {
        //   allowed_countries: ['FR', 'BE', 'CH', 'LU'],
        // },

        // Permet de capturer le paiement immédiatement
        payment_intent_data: {
          capture_method: 'automatic',
          description: `Commande ${order.orderNumber} - ${order.customerName}`,
          metadata: {
            orderId: order.id.toString(),
            orderNumber: order.orderNumber,
          },
        },

        // Configuration de la session
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expire après 30 minutes

        // Options recommandées par Stripe
        locale: 'fr', // Interface en français
        phone_number_collection: {
          enabled: false, // On l'a déjà collecté
        },
      })

      logger.info(`[Stripe] Session créée: ${session.id}`)

      return {
        sessionId: session.id,
        checkoutUrl: session.url!,
      }
    } catch (error) {
      logger.error(`[Stripe] Erreur création session: ${error.message}`)
      throw new Error(`Erreur lors de la création de la session de paiement: ${error.message}`)
    }
  }

  /**
   * Récupérer une session Stripe Checkout
   */
  async getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId)
    } catch (error) {
      logger.error(`[Stripe] Erreur récupération session ${sessionId}: ${error.message}`)
      throw new Error(`Erreur lors de la récupération de la session: ${error.message}`)
    }
  }

  /**
   * Valider la signature d'un webhook Stripe (sécurité critique)
   */
  constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event {
    try {
      const webhookSecret = env.get('STRIPE_WEBHOOK_SECRET')
      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (error) {
      logger.error(`[Stripe] Erreur validation webhook: ${error.message}`)
      throw new Error('Signature webhook invalide')
    }
  }

  /**
   * Récupérer le client Stripe (pour usage avancé)
   */
  getStripeClient(): Stripe {
    return this.stripe
  }
}

// Export une instance singleton
export default new StripeService()
