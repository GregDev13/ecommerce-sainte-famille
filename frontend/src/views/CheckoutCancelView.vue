<template>
  <div class="min-h-screen max-w-3xl mx-auto py-6 sm:py-12 px-4">
    <div class="text-center">
      <!-- Icône d'annulation -->
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-4">
          <svg class="w-16 h-16 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
      </div>

      <!-- Message d'annulation -->
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Paiement annulé
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        Vous avez annulé le processus de paiement.
      </p>

      <!-- Informations -->
      <div class="card p-6 sm:p-8 mb-8 text-left">
        <div class="flex gap-4 mb-6">
          <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Que s'est-il passé ?</h2>
            <p class="text-gray-600 mb-4">
              Votre commande a été créée mais le paiement n'a pas été finalisé.
              Aucun montant n'a été débité de votre compte.
            </p>
          </div>
        </div>

        <div v-if="orderNumber" class="p-4 bg-gray-50 rounded-lg mb-4">
          <p class="text-sm text-gray-600 mb-1">Numéro de commande</p>
          <p class="font-mono font-semibold text-gray-900">{{ orderNumber }}</p>
        </div>

        <div class="p-4 bg-orange-50 rounded-lg">
          <p class="text-sm text-orange-800">
            <strong>Note importante :</strong> Les articles de votre panier ont été réservés temporairement.
            Si vous ne finalisez pas votre paiement, le stock sera remis à disposition.
          </p>
        </div>
      </div>

      <!-- Options -->
      <div class="card p-6 sm:p-8 mb-8 text-left">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Que souhaitez-vous faire ?</h2>
        <ul class="space-y-3 text-gray-600">
          <li class="flex gap-3">
            <span class="text-gold-600">•</span>
            <span>Recommencer le processus de paiement en créant une nouvelle commande</span>
          </li>
          <li class="flex gap-3">
            <span class="text-gold-600">•</span>
            <span>Modifier votre panier et ajouter d'autres produits</span>
          </li>
          <li class="flex gap-3">
            <span class="text-gold-600">•</span>
            <span>Nous contacter si vous avez besoin d'aide</span>
          </li>
        </ul>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link to="/checkout" class="btn-primary">
          Recommencer le paiement
        </router-link>
        <router-link to="/cart" class="btn-secondary">
          Retour au panier
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
const orderNumber = ref('')

onMounted(() => {
  // Récupérer le numéro de commande depuis l'URL
  orderNumber.value = route.query.order_number as string || ''
})
</script>
