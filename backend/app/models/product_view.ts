import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductView extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare productId: number

  @column()
  declare sessionId: string | null

  @column()
  declare ipAddress: string | null

  @column()
  declare userAgent: string | null

  @column.dateTime()
  declare viewedAt: DateTime

  // Relation with Product
  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  /**
   * Track a product view
   * @param productId - The product ID to track
   * @param ctx - HTTP context to extract metadata
   */
  static async trackView(productId: number, ctx: HttpContext) {
    const view = new ProductView()
    view.productId = productId
    view.ipAddress = ctx.request.ip()
    view.userAgent = ctx.request.header('user-agent') || null
    view.viewedAt = DateTime.now()

    await view.save()
    return view
  }
}