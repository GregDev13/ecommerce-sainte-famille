import Order from '#models/order'
import { BaseMail } from '@adonisjs/mail'
import env from '#start/env'

export default class OrderAvailableNotification extends BaseMail {
  from = env.get('MAILGUN_FROM_EMAIL')
  subject = '🎁 Votre commande est disponible au retrait !'

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

    this.message.to(this.order.customerEmail)
    this.message.htmlView('emails/order_available_notification', {
      order: this.order,
      appUrl,
      frontendUrl,
    })
  }
}
