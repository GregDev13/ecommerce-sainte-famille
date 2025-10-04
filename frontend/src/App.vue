<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-2xl font-bold text-gold-600">
              🎄 Marché de Noël la Sainte Famille
            </router-link>
          </div>

          <div class="hidden md:flex items-center space-x-8">
            <router-link
              to="/products"
              class="text-gray-700 hover:text-gold-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Produits
            </router-link>
            <router-link
              to="/cart"
              class="text-gray-700 hover:text-gold-600 px-3 py-2 text-sm font-medium relative transition-colors"
            >
              🛒 Panier
              <span
                v-if="cartStore.itemCount > 0"
                class="absolute -top-1 -right-1 bg-gold-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
              >
                {{ cartStore.itemCount }}
              </span>
            </router-link>
            <router-link
              to="/admin/login"
              class="text-gray-500 hover:text-gold-600 px-3 py-2 text-xs font-medium transition-colors"
            >
              🔐 Admin
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main>
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <h5 class="text-lg font-semibold mb-2">
              🎄 Marché de Noël la Sainte Famille
            </h5>
            <p class="text-gray-400">Votre boutique familiale en ligne</p>
          </div>
          <div class="text-center md:text-right">
            <p class="text-gray-400">&copy; 2024 Marché de Noël la Sainte Famille. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Styles spécifiques pour la navigation - CSS pur pour éviter les conflits */
.router-link-active {
  color: #a67c52 !important; /* gold-600 */
  border-bottom: 2px solid #a67c52 !important;
}

/* Forcer la couleur gold sur TOUS les états des liens pour supprimer l'orange */
a:focus-visible,
a:focus,
a:active,
a:hover:active {
  outline-color: #c19a6b !important; /* gold-500 */
  text-decoration-color: #c19a6b !important;
  color: #a67c52 !important; /* gold-600 */
  border-color: #c19a6b !important;
}

/* Supprimer spécifiquement le underline orange de Chrome/Firefox */
a:-webkit-any-link:active {
  color: #a67c52 !important;
  text-decoration-color: #c19a6b !important;
}
</style>
