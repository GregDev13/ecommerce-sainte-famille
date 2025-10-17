import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('payment_method', ['wero', 'paypal']).notNullable().defaultTo('wero')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('payment_method')
    })
  }
}