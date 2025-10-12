<template>
  <div class="min-h-screen max-w-3xl mx-auto py-6 sm:py-12 px-4">
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block w-16 h-16 border-4 border-gold-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-600">Vérification du paiement...</p>
    </div>

    <div v-else-if="error" class="text-center py-16">
      <div class="text-8xl mb-6">❌</div>
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Erreur de vérification</h1>
      <p class="text-gray-600 mb-8">{{ error }}</p>
      <router-link to="/" class="btn-primary inline-block">
        Retour à l'accueil
      </router-link>
    </div>

    <div v-else class="text-center">
      <!-- Animation de succès -->
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
          <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>

      <!-- Message de succès -->
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Paiement réussi !
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        Votre commande a été validée et payée avec succès.
      </p>

      <!-- Informations de commande -->
      <div v-if="orderNumber" class="card p-6 sm:p-8 mb-8 text-left">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Détails de votre commande</h2>

        <div class="space-y-3">
          <div class="flex justify-between py-3 border-b border-gray-200">
            <span class="text-gray-600">Numéro de commande</span>
            <span class="font-semibold text-gray-900">{{ orderNumber }}</span>
          </div>
        </div>

        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <div class="flex gap-3">
            <svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <div>
              <p class="font-semibold text-blue-900 mb-1">Email de confirmation envoyé</p>
              <p class="text-sm text-blue-800">
                Vous allez recevoir un email de confirmation avec tous les détails de votre commande.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Prochaines étapes -->
      <div class="card p-6 sm:p-8 mb-8 text-left">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Prochaines étapes</h2>
        <ul class="space-y-3">
          <li class="flex gap-3">
            <span class="text-gold-600 font-bold">1.</span>
            <span class="text-gray-600">Vous recevrez un email de confirmation à l'adresse fournie</span>
          </li>
          <li class="flex gap-3">
            <span class="text-gold-600 font-bold">2.</span>
            <span class="text-gray-600">Votre commande sera préparée dans les plus brefs délais</span>
          </li>
          <li class="flex gap-3">
            <span class="text-gold-600 font-bold">3.</span>
            <span class="text-gray-600">Vous serez contacté pour la livraison ou le retrait</span>
          </li>
        </ul>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link to="/" class="btn-primary">
          Retour à l'accueil
        </router-link>
        <router-link to="/products" class="btn-secondary">
          Continuer mes achats
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(true)
const error = ref('')
const orderNumber = ref('')

onMounted(async () => {
  try {
    // Récupérer les paramètres de l'URL
    const sessionId = route.query.session_id as string
    orderNumber.value = route.query.order_number as string

    if (!sessionId || !orderNumber.value) {
      throw new Error('Informations de commande manquantes')
    }

    // Le paiement est géré par le webhook, on affiche juste la confirmation
    loading.value = false
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue'
    loading.value = false
  }
})
</script>
