import Order from '#models/order'
import { BaseMail } from '@adonisjs/mail'
import env from '#start/env'
import { paymentInstructions } from '#config/payment_instructions'

export default class OrderConfirmationNotification extends BaseMail {
  from = env.get('MAILGUN_FROM_EMAIL')
  subject = 'Confirmation de votre commande'

  constructor(private order: Order) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    const appUrl = env.get('APP_URL', 'http://localhost:3334')
    const frontendUrl = env.get('FRONTEND_URL')

    // Récupérer les instructions de paiement selon la méthode choisie
    const instructions = paymentInstructions[this.order.paymentMethod]

    this.message.to(this.order.customerEmail)
    this.message.htmlView('emails/order_confirmation', {
      order: this.order,
      appUrl,
      frontendUrl,
      paymentInstructions: instructions,
      currentYear: new Date().getFullYear(),
    })
  }
}
