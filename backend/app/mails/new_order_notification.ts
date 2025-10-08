import Order from '#models/order'
import { BaseMail } from '@adonisjs/mail'
import env from '#start/env'

export default class NewOrderNotification extends BaseMail {
  from = env.get('MAILGUN_FROM_EMAIL')
  subject = '🎄 Nouvelle commande reçue'

  constructor(private order: Order) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    const adminEmail = env.get('ADMIN_EMAIL')
    const appUrl = env.get('APP_URL', 'http://localhost:3334')
    const frontendUrl = env.get('VITE_API_URL', 'http://localhost:5173')

    this.message.to(adminEmail)
    this.message.htmlView('emails/new_order_admin', {
      order: this.order,
      appUrl,
      frontendUrl,
    })
  }
}
