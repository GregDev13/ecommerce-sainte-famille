import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Middleware to ensure the authenticated user is an admin
 */
export default class AdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    try {
      // Vérifier que l'utilisateur est authentifié
      const user = auth.getUserOrFail()

      // Vérifier que l'utilisateur est admin
      if (user.role !== 'admin') {
        return response.forbidden({
          message: 'Accès réservé aux administrateurs'
        })
      }

      // Continuer
      await next()
    } catch (error) {
      return response.unauthorized({
        message: 'Non authentifié'
      })
    }
  }
}
