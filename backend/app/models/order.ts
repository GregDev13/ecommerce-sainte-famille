import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import OrderItem from './order_item.js'
import type { OrderStatus } from '#core/enums/order_status'
import type { OrderType } from '#core/enums/order_type'
import type { PaymentMethod } from '#core/enums/payment_method'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderNumber: string

  @column()
  declare userId: number | null

  @column()
  declare customerName: string

  @column()
  declare customerEmail: string

  @column()
  declare customerPhone: string

  @column()
  declare totalAmount: number

  @column()
  declare status: OrderStatus

  @column()
  declare type: OrderType

  @column()
  declare stripePaymentIntentId: string | null

  @column()
  declare paymentMethod: PaymentMethod

  @column()
  declare shippingAddress: string | null

  @column()
  declare notes: string | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => OrderItem)
  declare orderItems: HasMany<typeof OrderItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}