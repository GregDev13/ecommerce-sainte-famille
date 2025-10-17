import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import OrderItem from './order_item.js'

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
  declare status: string

  @column()
  declare type: string

  @column()
  declare stripePaymentIntentId: string | null

  @column()
  declare paymentMethod: 'wero' | 'paypal'

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