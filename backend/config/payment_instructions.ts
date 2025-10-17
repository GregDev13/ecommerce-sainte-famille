import env from '#start/env'

/**
 * Configuration des instructions de paiement manuel
 * pour Wero et PayPal
 */
export const paymentInstructions = {
  wero: {
    title: 'Paiement par Wero',
    instructions: [
      'Ouvrez votre application bancaire compatible Wero',
      'Sélectionnez "Envoyer de l\'argent"',
      "Utilisez l'adresse email ci-dessous",
      'Indiquez le numéro de commande dans le message',
    ],
    email: env.get('WERO_EMAIL'),
    accountHolder: env.get('WERO_ACCOUNT_HOLDER'),
  },
  paypal: {
    title: 'Paiement par PayPal',
    instructions: [
      'Connectez-vous à votre compte PayPal',
      "Envoyez le paiement à l'adresse email ci-dessous",
      'Indiquez le numéro de commande dans la note du paiement',
    ],
    email: env.get('PAYPAL_EMAIL'),
  },
}
