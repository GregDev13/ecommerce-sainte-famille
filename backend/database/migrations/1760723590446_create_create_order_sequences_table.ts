import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_sequences'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('current_value').notNullable().defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // Insérer la ligne initiale pour la séquence
    this.defer(async (db) => {
      await db.table(this.tableName).insert({
        current_value: 0,
        created_at: new Date(),
        updated_at: new Date(),
      })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}