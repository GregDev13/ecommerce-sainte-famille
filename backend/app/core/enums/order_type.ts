/**
 * Order type enum definition
 * Distinguishes between direct orders and reservations
 */

export const ORDER_TYPE = {
  ORDER: 'order',
  RESERVATION: 'reservation',
} as const

export type OrderType = typeof ORDER_TYPE[keyof typeof ORDER_TYPE]

// Array for database migration enum
export const ORDER_TYPE_ARRAY = Object.values(ORDER_TYPE)

// Labels for display
export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  [ORDER_TYPE.ORDER]: 'Commande',
  [ORDER_TYPE.RESERVATION]: 'Réservation',
}