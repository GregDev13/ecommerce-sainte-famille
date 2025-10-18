import { BaseSchema } from '@adonisjs/lucid/schema'
import { ORDER_STATUS_ARRAY, ORDER_STATUS } from '#core/enums/order_status'
import { ORDER_TYPE_ARRAY } from '#core/enums/order_type'
import { PAYMENT_METHOD_ARRAY } from '#core/enums/payment_method'

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

      // Use centralized enums
      table.enum('status', ORDER_STATUS_ARRAY).defaultTo(ORDER_STATUS.PENDING_PAYMENT)
      table.enum('type', ORDER_TYPE_ARRAY).notNullable()
      table.enum('payment_method', PAYMENT_METHOD_ARRAY).notNullable()

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
