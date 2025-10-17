/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring drive
  |----------------------------------------------------------
  */
  DRIVE_DISK: Env.schema.enum(['fs'] as const),
  APP_URL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the mail package
  |----------------------------------------------------------
  */
  MAILGUN_API_KEY: Env.schema.string(),
  MAILGUN_DOMAIN: Env.schema.string(),
  MAILGUN_API_URL: Env.schema.string.optional(),
  MAILGUN_FROM_EMAIL: Env.schema.string(),
  MAILGUN_FROM_NAME: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Admin email for notifications
  |----------------------------------------------------------
  */
  ADMIN_EMAIL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Frontend URL for email links
  |----------------------------------------------------------
  */
  FRONTEND_URL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for payment instructions (Wero & PayPal)
  |----------------------------------------------------------
  */
  WERO_EMAIL: Env.schema.string(),
  WERO_ACCOUNT_HOLDER: Env.schema.string(),
  PAYPAL_EMAIL: Env.schema.string(),
})
