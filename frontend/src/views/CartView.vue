<template>
  <div class="min-h-screen max-w-6xl mx-auto py-6 sm:py-8 px-4">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Mon Panier</h1>

    <!-- Empty cart state -->
    <div v-if="cartStore.itemCount === 0" class="text-center py-16">
      <div class="text-8xl mb-6">🛒</div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Votre panier est vide</h2>
      <p class="text-gray-600 mb-8">Découvrez nos produits et ajoutez-les à votre panier</p>
      <router-link to="/products" class="btn-primary inline-block">
        Découvrir nos produits
      </router-link>
    </div>

    <!-- Cart with items -->
    <div v-else class="grid lg:grid-cols-3 gap-8">
      <!-- Cart items -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cartStore.cartItems"
          :key="item.id"
          class="card p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6"
        >
          <div class="flex gap-4 sm:gap-6 flex-1">
            <!-- Product image -->
            <div class="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
              <img
                v-if="item.image?.url"
                :src="item.image.url"
                :alt="item.name"
                class="w-full h-full object-cover"
              />
              <span v-else class="flex items-center justify-center h-full text-2xl sm:text-3xl">📦</span>
            </div>

            <!-- Product info -->
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-base sm:text-lg text-gray-900 mb-1 truncate">{{ item.name }}</h3>
              <p class="text-gold-700 font-bold text-base sm:text-lg">{{ item.price.toFixed(2) }} €</p>

              <!-- Quantity controls -->
              <div class="flex items-center gap-2 sm:gap-3 mt-4">
                <button
                  @click="decreaseQuantity(item.id)"
                  class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  :disabled="item.quantity <= 1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>

                <input
                  type="number"
                  :value="item.quantity"
                  @change="updateQuantity(item.id, $event)"
                  min="1"
                  :max="item.stock"
                  class="w-14 sm:w-16 text-center border border-gray-300 rounded-lg py-1 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />

                <button
                  @click="increaseQuantity(item.id)"
                  class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  :disabled="item.quantity >= item.stock"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>

                <span class="text-xs sm:text-sm text-gray-500">
                  ({{ item.stock }} en stock)
                </span>
              </div>
            </div>
          </div>

          <!-- Item total and remove -->
          <div class="flex sm:flex-col justify-between sm:justify-between items-center sm:items-end sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 mt-3 sm:mt-0">
            <button
              @click="removeItem(item.id)"
              class="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1 order-2 sm:order-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span class="hidden sm:inline">Supprimer</span>
            </button>
            <div class="font-bold text-lg sm:text-xl text-gray-900 order-1 sm:order-2">
              {{ (item.price * item.quantity).toFixed(2) }} €
            </div>
          </div>
        </div>

        <!-- Clear cart button -->
        <div class="pt-4">
          <button
            @click="confirmClearCart"
            class="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Vider le panier
          </button>
        </div>
      </div>

      <!-- Order summary -->
      <div class="lg:col-span-1">
        <div class="card p-6 sticky top-4">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h2>

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

          <router-link to="/checkout" class="btn-primary w-full mb-3 block text-center">
            Passer la commande
          </router-link>

          <router-link to="/products" class="btn-secondary w-full block text-center">
            Continuer mes achats
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toastification'

const API_URL = import.meta.env.VITE_API_URL
const cartStore = useCartStore()
const toast = useToast()

const increaseQuantity = (productId: number) => {
  try {
    const item = cartStore.cartItems.find(i => i.id === productId)
    if (item) {
      cartStore.updateQuantity(productId, item.quantity + 1)
    }
  } catch (error: any) {
    toast.error(error.message || 'Erreur lors de la mise à jour')
  }
}

const decreaseQuantity = (productId: number) => {
  const item = cartStore.cartItems.find(i => i.id === productId)
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(productId, item.quantity - 1)
  }
}

const updateQuantity = (productId: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const newQuantity = parseInt(input.value)

  if (newQuantity > 0) {
    try {
      cartStore.updateQuantity(productId, newQuantity)
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour')
      // Reset to current quantity
      const item = cartStore.cartItems.find(i => i.id === productId)
      if (item) {
        input.value = item.quantity.toString()
      }
    }
  }
}

const removeItem = (productId: number) => {
  cartStore.removeItem(productId)
  toast.success('Produit retiré du panier')
}

const confirmClearCart = () => {
  if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
    cartStore.clearCart()
    toast.info('Panier vidé')
  }
}
</script>
