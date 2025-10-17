<template>
  <div class="min-h-screen max-w-4xl mx-auto py-6 sm:py-8 px-4">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Finaliser ma commande</h1>

    <div v-if="cartStore.itemCount === 0" class="text-center py-16">
      <div class="text-8xl mb-6">🛒</div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Votre panier est vide</h2>
      <router-link to="/products" class="btn-primary inline-block">
        Découvrir nos produits
      </router-link>
    </div>

    <div v-else class="grid lg:grid-cols-3 gap-8">
      <!-- Formulaire de commande -->
      <div class="lg:col-span-2">
        <div class="card p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Informations de livraison</h2>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Nom complet -->
            <div>
              <label for="customerName" class="block text-sm font-medium text-gray-700 mb-2">
                Nom complet <span class="text-red-500">*</span>
              </label>
              <input
                id="customerName"
                v-model="formData.customerName"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="Jean Dupont"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="customerEmail" class="block text-sm font-medium text-gray-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                id="customerEmail"
                v-model="formData.customerEmail"
                type="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="jean.dupont@example.com"
              />
            </div>

            <!-- Téléphone -->
            <div>
              <label for="customerPhone" class="block text-sm font-medium text-gray-700 mb-2">
                Téléphone <span class="text-red-500">*</span>
              </label>
              <input
                id="customerPhone"
                v-model="formData.customerPhone"
                type="tel"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="06 12 34 56 78"
              />
            </div>

            <!-- Adresse de livraison -->
            <div>
              <label for="shippingAddress" class="block text-sm font-medium text-gray-700 mb-2">
                Adresse de livraison <span class="text-red-500">*</span>
              </label>
              <textarea
                id="shippingAddress"
                v-model="formData.shippingAddress"
                required
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                placeholder="12 rue de la Paix&#10;75001 Paris&#10;France"
              ></textarea>
            </div>

            <!-- Notes (optionnel) -->
            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
                Commentaires (optionnel)
              </label>
              <textarea
                id="notes"
                v-model="formData.notes"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                placeholder="Instructions de livraison, préférences..."
              ></textarea>
            </div>

            <!-- Méthode de paiement -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Méthode de paiement <span class="text-red-500">*</span>
              </label>
              <div class="grid sm:grid-cols-2 gap-4">
                <!-- Wero -->
                <label
                  :class="[
                    'relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all',
                    formData.paymentMethod === 'wero'
                      ? 'border-gold-600 bg-gold-50'
                      : 'border-gray-300 hover:border-gold-400 bg-white'
                  ]"
                >
                  <input
                    type="radio"
                    v-model="formData.paymentMethod"
                    value="wero"
                    class="sr-only"
                  />
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-2xl flex-shrink-0">
                    🏦
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold text-gray-900">Wero</div>
                    <div class="text-xs text-gray-500">Virement bancaire instantané</div>
                  </div>
                  <div
                    v-if="formData.paymentMethod === 'wero'"
                    class="absolute top-2 right-2 w-6 h-6 bg-gold-600 rounded-full flex items-center justify-center"
                  >
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </label>

                <!-- PayPal -->
                <label
                  :class="[
                    'relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all',
                    formData.paymentMethod === 'paypal'
                      ? 'border-gold-600 bg-gold-50'
                      : 'border-gray-300 hover:border-gold-400 bg-white'
                  ]"
                >
                  <input
                    type="radio"
                    v-model="formData.paymentMethod"
                    value="paypal"
                    class="sr-only"
                  />
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white text-2xl flex-shrink-0">
                    💳
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold text-gray-900">PayPal</div>
                    <div class="text-xs text-gray-500">Paiement PayPal</div>
                  </div>
                  <div
                    v-if="formData.paymentMethod === 'paypal'"
                    class="absolute top-2 right-2 w-6 h-6 bg-gold-600 rounded-full flex items-center justify-center"
                  >
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </label>
              </div>
              <p class="mt-2 text-sm text-gray-500">
                Vous recevrez les instructions de paiement après validation de votre commande.
              </p>
            </div>

            <!-- Messages d'erreur -->
            <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-red-600 text-sm">{{ errorMessage }}</p>
            </div>

            <!-- Boutons d'action -->
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                type="submit"
                :disabled="loading"
                class="btn-primary flex-1 min-h-[44px]"
              >
                <span v-if="loading">Traitement en cours...</span>
                <span v-else>Valider ma commande</span>
              </button>
              <router-link to="/cart" class="btn-secondary flex-1 text-center min-h-[44px] flex items-center justify-center">
                Retour au panier
              </router-link>
            </div>
          </form>
        </div>
      </div>

      <!-- Récapitulatif de commande -->
      <div class="lg:col-span-1">
        <div class="card p-6 sticky top-4">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h2>

          <!-- Articles -->
          <div class="space-y-4 mb-6 max-h-96 overflow-y-auto">
            <div
              v-for="item in cartStore.cartItems"
              :key="item.id"
              class="flex gap-3 pb-4 border-b border-gray-200 last:border-0"
            >
              <div class="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  v-if="item.image?.url"
                  :src="item.image.url"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
                <span v-else class="flex items-center justify-center h-full text-2xl">📦</span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h3>
                <p class="text-sm text-gray-500">Qté: {{ item.quantity }}</p>
                <p class="text-sm font-semibold text-gold-700">
                  {{ (item.price * item.quantity).toFixed(2) }} €
                </p>
              </div>
            </div>
          </div>

          <!-- Totaux -->
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-gray-600">
              <span>Sous-total ({{ cartStore.itemCount }} article{{ cartStore.itemCount > 1 ? 's' : '' }})</span>
              <span class="font-medium">{{ cartStore.totalPrice.toFixed(2) }} €</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Livraison</span>
              <span class="font-medium text-green-600">Gratuite</span>
            </div>
            <div class="border-t border-gray-200 pt-3 mt-3">
              <div class="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span class="text-gold-700">{{ cartStore.totalPrice.toFixed(2) }} €</span>
              </div>
            </div>
          </div>

          <!-- Informations de sécurité -->
          <div class="bg-gold-50 p-4 rounded-lg">
            <div class="flex gap-2 mb-2">
              <svg class="w-5 h-5 text-gold-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <h3 class="font-semibold text-gold-900 text-sm">Paiement sécurisé</h3>
            </div>
            <p class="text-xs text-gold-800">
              Vos informations sont protégées et ne seront jamais partagées.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { ordersApi } from '@/services/api'
import { useToast } from 'vue-toastification'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()
const cartStore = useCartStore()
const toast = useToast()

const loading = ref(false)
const errorMessage = ref('')

const formData = ref({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  shippingAddress: '',
  notes: '',
  paymentMethod: 'wero' as 'wero' | 'paypal',
})

const handleSubmit = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    // Préparer les données de la commande
    const orderData = {
      ...formData.value,
      items: cartStore.cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    }

    // Créer la commande
    const response = await ordersApi.create(orderData)

    // Succès - vider le panier et rediriger
    cartStore.clearCart()
    toast.success('Commande validée avec succès !', {
      timeout: 3000,
    })

    // Rediriger vers la page de confirmation
    router.push(`/order-confirmation/${response.data.orderNumber}`)
  } catch (error: any) {
    console.error('Erreur lors de la création de la commande:', error)
    errorMessage.value = error.response?.data?.message || 'Une erreur est survenue lors de la validation de votre commande'
    toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}
</script>
