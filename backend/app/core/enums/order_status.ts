/**
 * Order status enum definition
 * Centralized to ensure consistency across the application
 */

export const ORDER_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  PAID: 'paid',
  PREPARING: 'preparing',
  READY: 'ready',
  AVAILABLE: 'available',
  CANCELLED: 'cancelled',
} as const

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS]

// Array for database migration enum
export const ORDER_STATUS_ARRAY = Object.values(ORDER_STATUS)

// Labels for display
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [ORDER_STATUS.PENDING_PAYMENT]: 'En attente de paiement',
  [ORDER_STATUS.PAID]: 'Payée',
  [ORDER_STATUS.PREPARING]: 'En cours de préparation',
  [ORDER_STATUS.READY]: 'Prête',
  [ORDER_STATUS.AVAILABLE]: 'Disponible',
  [ORDER_STATUS.CANCELLED]: 'Annulée',
}

// Colors for UI display
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [ORDER_STATUS.PENDING_PAYMENT]: 'orange',
  [ORDER_STATUS.PAID]: 'green',
  [ORDER_STATUS.PREPARING]: 'blue',
  [ORDER_STATUS.READY]: 'purple',
  [ORDER_STATUS.AVAILABLE]: 'emerald',
  [ORDER_STATUS.CANCELLED]: 'red',
}