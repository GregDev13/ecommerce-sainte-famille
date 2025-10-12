# Configuration Stripe - Guide complet

## 🚀 Résumé de l'implémentation

Votre application e-commerce utilise maintenant **Stripe Checkout** pour gérer les paiements de manière sécurisée et simple.

### Architecture

1. **Frontend (Vue 3)** : Crée une commande et redirige vers Stripe
2. **Backend (AdonisJS)** : Crée une session Stripe Checkout
3. **Stripe Checkout** : Page de paiement hébergée par Stripe
4. **Webhook** : Confirme le paiement et met à jour la commande

---

## 📋 Configuration en développement

### 1. Obtenir les clés API Stripe

1. Créer un compte sur [stripe.com](https://stripe.com)
2. Aller dans **Developers > API keys**
3. Récupérer :
   - **Clé secrète** : `sk_test_...`
   - **Clé publique** : `pk_test_...` (pour usage futur)

### 2. Configurer les variables d'environnement

Dans `/backend/.env` :

```env
# Stripe Payment Configuration
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret
FRONTEND_URL=http://localhost:5173
```

### 3. Installer les dépendances

```bash
cd backend
npm install
```

Le package `stripe` est déjà installé.

### 4. Tester avec Stripe CLI (Local)

Pour tester les webhooks en local :

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Écouter les webhooks (laissez tourner dans un terminal)
stripe listen --forward-to http://localhost:3333/api/v1/webhooks/stripe

# Récupérer le webhook secret affiché et le mettre dans .env
# Exemple : whsec_xxxxxxxxxxxxx
```

### 5. Cartes de test Stripe

Pour tester les paiements :

- **Paiement réussi** : `4242 4242 4242 4242`
- **Paiement échoué** : `4000 0000 0000 0002`
- **3D Secure requis** : `4000 0027 6000 3184`
- Date d'expiration : n'importe quelle date future
- CVC : n'importe quel 3 chiffres
- Code postal : n'importe lequel

---

## 🏭 Configuration en production

### 1. Obtenir les clés de production

1. Dans le dashboard Stripe, passer en mode **Live** (toggle en haut à droite)
2. Aller dans **Developers > API keys**
3. Récupérer :
   - **Clé secrète Live** : `sk_live_...`
   - **Clé publique Live** : `pk_live_...`

### 2. Configurer les webhooks en production

1. Dans Stripe Dashboard (mode Live) : **Developers > Webhooks**
2. Cliquer sur **Add endpoint**
3. Configurer :
   - **URL** : `https://votre-domaine.com/api/v1/webhooks/stripe`
   - **Description** : `Production webhook for order payments`
   - **Events à écouter** :
     - `checkout.session.completed`
     - `payment_intent.payment_failed`
4. Cliquer sur **Add endpoint**
5. Révéler et copier le **Signing secret** : `whsec_...`

### 3. Variables d'environnement de production

Dans votre serveur de production, configurer `/backend/.env` :

```env
# Stripe Payment Configuration - PRODUCTION
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_LIVE
STRIPE_PUBLISHABLE_KEY=pk_live_VOTRE_CLE_PUBLIQUE_LIVE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET_PRODUCTION
FRONTEND_URL=https://votre-domaine-frontend.com
APP_URL=https://votre-domaine-backend.com
```

⚠️ **IMPORTANT** : Ne JAMAIS commiter ces clés dans Git !

### 4. Vérifier la configuration du serveur

Le webhook doit être accessible en HTTPS. Votre configuration Caddy existante devrait déjà gérer cela :

```caddyfile
# Dans votre Caddyfile
votre-domaine.com {
    reverse_proxy backend:3333
    # Le webhook sera accessible sur https://votre-domaine.com/api/v1/webhooks/stripe
}
```

### 5. Tester en production

1. Faire un achat test avec une vraie carte (montant minimum)
2. Vérifier dans les logs du backend : `[Stripe Webhook] Paiement complété pour commande CMD-...`
3. Vérifier dans Stripe Dashboard > Payments que le paiement apparaît
4. Vérifier que les emails sont envoyés

---

## 🔧 Configuration avancée

### Activer les modes de paiement supplémentaires

Dans `backend/app/services/stripe_service.ts`, ligne 37 :

```typescript
payment_method_types: ['card', 'sepa_debit', 'ideal'], // Ajouter d'autres méthodes
```

Modes disponibles : `card`, `sepa_debit`, `ideal`, `bancontact`, `giropay`, `p24`, `eps`, `klarna`, etc.

### Personnaliser l'apparence de Stripe Checkout

Aller dans Stripe Dashboard > Settings > Branding :
- Logo de l'entreprise
- Couleurs de la marque
- Favicon

---

## 🔒 Sécurité

### Points critiques

✅ **Validation de signature webhook** : Implémentée dans `stripe_webhook_controller.ts:26`
✅ **Pas d'exposition des clés secrètes** : Variables d'environnement uniquement
✅ **HTTPS requis** : Pour les webhooks en production
✅ **Idempotence** : Gérée dans `stripe_webhook_controller.ts:82` (évite les doubles paiements)

### Recommandations

1. **Ne jamais** exposer `STRIPE_SECRET_KEY` dans le frontend
2. **Toujours** valider la signature des webhooks
3. **Utiliser HTTPS** pour tous les endpoints en production
4. **Monitorer** les logs pour détecter les tentatives de fraude
5. **Limiter** les tentatives de paiement par IP si nécessaire

---

## 📊 Monitoring et logs

### Logs backend

Tous les événements Stripe sont loggés avec le préfixe `[Stripe]` :

```bash
# Voir les logs en temps réel
docker logs -f backend

# Filtrer les logs Stripe
docker logs backend 2>&1 | grep Stripe
```

### Dashboard Stripe

- **Payments** : Voir tous les paiements
- **Customers** : Liste des clients
- **Webhooks** : Voir les webhooks reçus et leur statut
- **Logs** : Voir toutes les requêtes API

---

## 🐛 Dépannage

### Problème : Le webhook n'est pas reçu

1. Vérifier que l'URL est accessible : `curl https://votre-domaine.com/api/v1/webhooks/stripe`
2. Vérifier les logs du webhook dans Stripe Dashboard
3. Vérifier le `STRIPE_WEBHOOK_SECRET` dans `.env`
4. Vérifier les logs backend pour les erreurs

### Problème : Erreur "Signature webhook invalide"

- Le `STRIPE_WEBHOOK_SECRET` ne correspond pas à celui du dashboard
- Vérifier que vous utilisez le bon secret (test vs production)
- Redémarrer le serveur après modification du `.env`

### Problème : Le paiement réussit mais la commande reste "pending_payment"

- Le webhook n'a pas été reçu ou a échoué
- Vérifier les logs : `[Stripe Webhook] Paiement complété pour commande`
- Stripe renvoie automatiquement les webhooks échoués (jusqu'à 3 jours)
- Possibilité de renvoyer manuellement depuis le dashboard

### Problème : Stock non restauré après annulation

- C'est normal, le stock est restauré seulement si le paiement échoue (`payment_intent.payment_failed`)
- Pour les annulations, le stock reste réservé pendant 30 minutes (expiration de la session)
- Implémenter un job cron pour nettoyer les commandes expirées si nécessaire

---

## 📈 Prochaines étapes (optionnel)

1. **Ajouter d'autres modes de paiement** (SEPA, PayPal via Stripe)
2. **Implémenter les remboursements** depuis l'admin
3. **Ajouter les factures PDF** générées après paiement
4. **Créer un dashboard des ventes** avec les stats Stripe
5. **Mettre en place les paiements récurrents** (abonnements)

---

## 🆘 Support

### Ressources Stripe

- Documentation : [stripe.com/docs](https://stripe.com/docs)
- Guides : [stripe.com/guides](https://stripe.com/guides)
- Support : [support.stripe.com](https://support.stripe.com)

### Tests

Pour tester l'intégration complète :

```bash
# Backend
cd backend
npm run dev

# Frontend (autre terminal)
cd frontend
npm run dev

# Stripe CLI (autre terminal) - pour webhooks locaux
stripe listen --forward-to http://localhost:3333/api/v1/webhooks/stripe
```

---

## ✅ Checklist de mise en production

- [ ] Clés Live Stripe configurées dans `.env`
- [ ] Webhook endpoint configuré dans Stripe Dashboard
- [ ] Webhook secret Live mis à jour dans `.env`
- [ ] FRONTEND_URL pointe vers le domaine de production
- [ ] HTTPS activé sur le backend
- [ ] Test d'achat complet effectué
- [ ] Emails de confirmation reçus
- [ ] Logs backend sans erreur
- [ ] Dashboard Stripe en mode Live activé
- [ ] Branding Stripe configuré (optionnel)

---

**Félicitations ! Votre système de paiement Stripe est opérationnel. 🎉**
