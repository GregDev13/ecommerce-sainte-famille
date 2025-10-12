import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    // Créer un utilisateur admin par défaut
    await User.updateOrCreate(
      { email: 'admin@soleil-du-sud.fr' },
      {
        email: 'admin@soleil-du-sud.fr',
        password: 'admin123', // Change ce mot de passe !
        fullName: 'Administrateur',
        role: 'admin',
      }
    )

    // Tu peux aussi créer un utilisateur client de test
    await User.updateOrCreate(
      { email: 'client@test.fr' },
      {
        email: 'client@test.fr',
        password: 'client123',
        fullName: 'Client Test',
        role: 'client',
      }
    )
  }
}
