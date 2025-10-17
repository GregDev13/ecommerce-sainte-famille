import type { HttpContext } from '@adonisjs/core/http'
import { paymentInstructions } from '#config/payment_instructions'

export default class PaymentInstructionsController {
  /**
   * Get payment instructions for a specific payment method
   */
  async show({ params, response }: HttpContext) {
    const { method } = params

    // Vérifier que la méthode est valide
    if (!['wero', 'paypal'].includes(method)) {
      return response.badRequest({
        message: 'Méthode de paiement invalide. Doit être "wero" ou "paypal"',
      })
    }

    const instructions = paymentInstructions[method as 'wero' | 'paypal']

    return response.ok({
      data: instructions,
      message: 'Instructions de paiement récupérées avec succès',
    })
  }
}
