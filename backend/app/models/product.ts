import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, computed } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { attachment } from '@jrmc/adonis-attachment'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'
import OrderItem from './order_item.js'
import env from '#start/env'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare price: number

  @column()
  declare stock: number

  @column()
  declare isActive: boolean

  @attachment({ folder: 'products' })
  declare image: Attachment | null

  @hasMany(() => OrderItem)
  declare orderItems: HasMany<typeof OrderItem>

  @computed()
  get formattedPrice() {
    const price = typeof this.price === 'string' ? Number.parseFloat(this.price) : this.price
    return `${price.toFixed(2)} €`
  }

  @computed()
  get isInStock() {
    const stock = typeof this.stock === 'string' ? Number.parseInt(this.stock) : this.stock
    return stock > 0
  }

  @computed()
  get imageUrl() {
    if (!this.image?.url) return null
    const appUrl = env.get('APP_URL')
    return `${appUrl}${this.image.url}`
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
