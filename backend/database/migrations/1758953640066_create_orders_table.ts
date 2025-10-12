import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('order_number').unique().notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .nullable()

      // Guest customer information
      table.string('customer_name').notNullable()
      table.string('customer_email').notNullable()
      table.string('customer_phone').notNullable()

      table.decimal('total_amount', 10, 2).notNullable()
      table
        .enum('status', ['pending', 'pending_payment', 'reserved', 'paid', 'shipped', 'delivered', 'cancelled', 'failed'])
        .defaultTo('pending')
      table.enum('type', ['order', 'reservation']).notNullable()
      table.string('stripe_payment_intent_id').nullable()
      table.text('shipping_address').nullable()
      table.text('notes').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
