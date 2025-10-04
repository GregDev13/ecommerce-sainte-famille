<template>
  <div class="min-h-screen max-w-3xl mx-auto py-8 px-4">
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mb-4"></div>
      <p class="text-gray-600">Chargement de votre commande...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-16">
      <div class="text-6xl mb-6">❌</div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Commande introuvable</h2>
      <p class="text-gray-600 mb-8">{{ error }}</p>
      <router-link to="/products" class="btn-primary inline-block">
        Retour à la boutique
      </router-link>
    </div>

    <!-- Success state -->
    <div v-else-if="order" class="space-y-6">
      <!-- En-tête de confirmation -->
      <div class="text-center py-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Commande validée !</h1>
        <p class="text-gray-600 mb-4">
          Merci pour votre commande. Vous allez recevoir un email de confirmation à l'adresse
          <span class="font-semibold text-gold-700">{{ order.customerEmail }}</span>
        </p>
        <div class="inline-block bg-gold-50 px-6 py-3 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Numéro de commande</p>
          <p class="text-2xl font-bold text-gold-700">{{ order.orderNumber }}</p>
        </div>
      </div>

      <!-- Détails de la commande -->
      <div class="card p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Détails de la commande</h2>

        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <!-- Informations client -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Informations client
            </h3>
            <div class="space-y-2 text-sm text-gray-600">
              <p>{{ order.customerName }}</p>
              <p>{{ order.customerEmail }}</p>
              <p>{{ order.customerPhone }}</p>
            </div>
          </div>

          <!-- Adresse de livraison -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Adresse de livraison
            </h3>
            <p class="text-sm text-gray-600 whitespace-pre-line">{{ order.shippingAddress }}</p>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="order.notes" class="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-semibold text-gray-900 mb-2 text-sm">Vos commentaires</h3>
          <p class="text-sm text-gray-600">{{ order.notes }}</p>
        </div>

        <!-- Articles commandés -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">Articles commandés</h3>
          <div class="space-y-4">
            <div
              v-for="item in order.orderItems"
              :key="item.id"
              class="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
            >
              <div class="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  v-if="item.product?.image?.url"
                  :src="`${API_URL}${item.product.image.url}`"
                  :alt="item.product.name"
                  class="w-full h-full object-cover"
                />
                <span v-else class="flex items-center justify-center h-full text-3xl">📦</span>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">{{ item.product?.name || 'Produit' }}</h4>
                <p class="text-sm text-gray-500">Quantité: {{ item.quantity }}</p>
                <p class="text-sm text-gray-500">Prix unitaire: {{ Number(item.unitPrice).toFixed(2) }} €</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">{{ Number(item.totalPrice).toFixed(2) }} €</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold text-gray-900">Total</span>
            <span class="text-2xl font-bold text-gold-700">{{ Number(order.totalAmount).toFixed(2) }} €</span>
          </div>
          <p class="text-sm text-green-600 text-right mt-1">Livraison gratuite</p>
        </div>
      </div>

      <!-- Statut de la commande -->
      <div class="card p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Statut de la commande</h2>
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 bg-gold-500 rounded-full animate-pulse"></div>
          <div>
            <p class="font-semibold text-gray-900">{{ getStatusLabel(order.status) }}</p>
            <p class="text-sm text-gray-600">{{ getStatusDescription(order.status) }}</p>
          </div>
        </div>
      </div>

      <!-- Prochaines étapes -->
      <div class="bg-gold-50 p-6 rounded-lg">
        <h3 class="font-semibold text-gold-900 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Prochaines étapes
        </h3>
        <ul class="space-y-2 text-sm text-gold-800">
          <li class="flex items-start gap-2">
            <span class="text-gold-600 mt-0.5">✓</span>
            <span>Vous allez recevoir un email de confirmation</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-gold-600 mt-0.5">✓</span>
            <span>Nous préparons votre commande</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-gold-600 mt-0.5">✓</span>
            <span>Vous serez notifié lors de l'expédition</span>
          </li>
        </ul>
      </div>

      <!-- Actions -->
      <div class="flex gap-4 justify-center pt-6">
        <router-link to="/products" class="btn-primary">
          Continuer mes achats
        </router-link>
        <router-link to="/" class="btn-secondary">
          Retour à l'accueil
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ordersApi, type Order } from '@/services/api'

const API_URL = import.meta.env.VITE_API_URL
const route = useRoute()

const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref('')

const loadOrder = async () => {
  try {
    loading.value = true
    const orderNumber = route.params.orderNumber as string
    const response = await ordersApi.getByOrderNumber(orderNumber)
    order.value = response.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Impossible de charger la commande'
    console.error('Erreur lors du chargement de la commande:', err)
  } finally {
    loading.value = false
  }
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    reserved: 'Réservée',
    paid: 'Payée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  }
  return labels[status] || status
}

const getStatusDescription = (status: string): string => {
  const descriptions: Record<string, string> = {
    pending: 'Votre commande est en cours de traitement',
    reserved: 'Les articles sont réservés pour vous',
    paid: 'Paiement confirmé, préparation en cours',
    shipped: 'Votre commande a été expédiée',
    delivered: 'Votre commande a été livrée',
    cancelled: 'Cette commande a été annulée',
  }
  return descriptions[status] || 'Statut de la commande'
}

onMounted(() => {
  loadOrder()
})
</script>
