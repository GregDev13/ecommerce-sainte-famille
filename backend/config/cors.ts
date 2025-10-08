import { defineConfig } from '@adonisjs/cors'
import env from '#start/env'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  enabled: true,

  /**
   * En développement, accepte toutes les origines
   * En production, limite aux domaines autorisés
   */
  origin: (origin) => {
    // En développement, accepter toutes les origines
    if (env.get('NODE_ENV') === 'development') {
      return true
    }

    // En production, liste blanche des origines autorisées
    const allowedOrigins = [
      env.get('APP_URL'), // URL principale du backend
      env.get('APP_URL').replace('https://', 'http://'), // Fallback HTTP
      'http://localhost',
      'http://localhost:80',
    ]

    // Si pas d'origine (requête same-origin ou Postman), accepter
    if (!origin) return true

    return allowedOrigins.includes(origin)
  },

  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
