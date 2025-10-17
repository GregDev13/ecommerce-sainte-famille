import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import db from '@adonisjs/lucid/services/db'

export default class OrderSequence extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare currentValue: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Génère le prochain numéro de commande de façon atomique
   * @returns Format SF-0001, SF-0002, etc.
   */
  static async getNextNumber(): Promise<string> {
    // Utiliser une transaction et un verrou pour éviter les doublons
    const trx = await db.transaction()

    try {
      // Récupérer la séquence avec verrou FOR UPDATE (thread-safe)
      const sequence = await trx
        .from('order_sequences')
        .where('id', 1)
        .forUpdate()
        .first()

      if (!sequence) {
        // Si aucune séquence n'existe, la créer
        await trx.table('order_sequences').insert({
          current_value: 1,
          created_at: new Date(),
          updated_at: new Date(),
        })
        await trx.commit()
        return 'SF-0001'
      }

      // Incrémenter la valeur
      const nextValue = sequence.current_value + 1

      // Mettre à jour la séquence
      await trx
        .from('order_sequences')
        .where('id', 1)
        .update({
          current_value: nextValue,
          updated_at: new Date(),
        })

      await trx.commit()

      // Formater avec padding (SF-0001, SF-0002, etc.)
      return `SF-${nextValue.toString().padStart(4, '0')}`
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}