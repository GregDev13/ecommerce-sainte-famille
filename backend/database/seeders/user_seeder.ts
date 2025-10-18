import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    // Créer un utilisateur admin par défaut
    await User.updateOrCreate(
      { email: 'support@boutiquesaintefamille.fr' },
      {
        email: 'support@boutiquesaintefamille.fr',
        password: 'S@!nteFamill€2025*', // Change ce mot de passe !
        fullName: 'Administrateur',
        role: 'admin',
      }
    )
  }
}
