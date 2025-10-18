/**
 * Payment method enum definition
 * Available payment methods for the Christmas market
 */

export const PAYMENT_METHOD = {
  WERO: 'wero',
  PAYPAL: 'paypal',
} as const

export type PaymentMethod = typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD]

// Array for database migration enum
export const PAYMENT_METHOD_ARRAY = Object.values(PAYMENT_METHOD)

// Labels for display
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PAYMENT_METHOD.WERO]: 'Wero',
  [PAYMENT_METHOD.PAYPAL]: 'PayPal',
}

// Payment instructions
export const PAYMENT_METHOD_INSTRUCTIONS: Record<PaymentMethod, string> = {
  [PAYMENT_METHOD.WERO]: 'Envoyez votre paiement via Wero au numéro +32 499 39 59 31',
  [PAYMENT_METHOD.PAYPAL]: 'Envoyez votre paiement via PayPal à paypal@saint-nicolas.com',
}