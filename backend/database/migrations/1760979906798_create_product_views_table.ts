import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_views'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign key to products table
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')

      // Session tracking for deduplication
      table.string('session_id').nullable()

      // Analytics metadata
      table.string('ip_address', 45).nullable() // 45 chars pour IPv6
      table.text('user_agent').nullable()

      // Timestamp of the view
      table.timestamp('viewed_at').notNullable().defaultTo(this.now())

      // Indexes for performance
      table.index('product_id')
      table.index('viewed_at')
      table.index(['product_id', 'viewed_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}