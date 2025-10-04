import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import logger from '@adonisjs/core/services/logger'

export default class AuthController {
  /**
   * Login admin
   */
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      logger.info(`[Admin Auth] Tentative de connexion pour: ${email}`)
      logger.info(`[Admin Auth] Tentative de connexion pour: ${password}`)

      // Vérifier les credentials
      const user = await User.verifyCredentials(email, password)
      logger.info(`[Admin Auth] Credentials vérifiés pour: ${email}`)

      // Vérifier que c'est un admin
      if (user.role !== 'admin') {
        logger.warn(`[Admin Auth] Accès refusé pour ${email} (role: ${user.role})`)
        return response.unauthorized({
          message: 'Accès non autorisé'
        })
      }

      // Générer un token
      const token = await User.accessTokens.create(user)
      logger.info(`[Admin Auth] Token créé pour admin: ${email}`)

      return response.ok({
        message: 'Connexion réussie',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
          },
          token: token.value!.release()
        },
      })
    } catch (error) {
      logger.error(`[Admin Auth] Échec de connexion: ${error.message}`)
      return response.unauthorized({
        message: 'Email ou mot de passe incorrect'
      })
    }
  }

  /**
   * Logout admin
   */
  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      logger.info(`[Admin Auth] Déconnexion de: ${user.email}`)
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)

      return response.ok({
        message: 'Déconnexion réussie'
      })
    } catch (error) {
      logger.error(`[Admin Auth] Erreur lors de la déconnexion: ${error.message}`)
      return response.internalServerError({
        message: 'Erreur lors de la déconnexion'
      })
    }
  }

  /**
   * Get current admin user
   */
  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      logger.debug(`[Admin Auth] Récupération infos user: ${user.email}`)

      return response.ok({
        data: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      })
    } catch (error) {
      logger.warn(`[Admin Auth] Tentative d'accès non authentifiée`)
      return response.unauthorized({
        message: 'Non authentifié'
      })
    }
  }
}
