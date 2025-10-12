<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const mobileMenuOpen = ref(false)

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
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

          <!-- Desktop navigation -->
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

          <!-- Mobile menu button -->
          <button
            @click="mobileMenuOpen = true"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Ouvrir le menu"
          >
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile menu overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        @click="closeMobileMenu"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      ></div>
    </Transition>

    <!-- Mobile menu panel -->
    <Transition
      enter-active-class="transition-transform duration-300"
      leave-active-class="transition-transform duration-300"
      enter-from-class="translate-x-full"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="mobileMenuOpen"
        class="fixed top-0 right-0 bottom-0 w-80 max-w-full bg-white shadow-xl z-50 md:hidden"
      >
        <!-- Mobile menu header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-bold text-gray-900">Menu</h2>
          <button
            @click="closeMobileMenu"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Fermer le menu"
          >
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Mobile menu links -->
        <nav class="flex flex-col p-4 space-y-2">
          <router-link
            to="/products"
            @click="closeMobileMenu"
            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gold-50 hover:text-gold-700 rounded-lg transition-colors font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            Produits
          </router-link>

          <router-link
            to="/cart"
            @click="closeMobileMenu"
            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gold-50 hover:text-gold-700 rounded-lg transition-colors font-medium relative"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Panier
            <span
              v-if="cartStore.itemCount > 0"
              class="ml-auto bg-gold-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold"
            >
              {{ cartStore.itemCount }}
            </span>
          </router-link>

          <router-link
            to="/admin/login"
            @click="closeMobileMenu"
            class="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gold-50 hover:text-gold-700 rounded-lg transition-colors font-medium text-sm"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Administration
          </router-link>
        </nav>
      </div>
    </Transition>

    <!-- Contenu principal -->
    <main>
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-3 gap-8 mb-8">
          <!-- Logo et description -->
          <div class="flex flex-col items-center md:items-start">
            <div class="mb-4 footer-logo-glow">
              <img
                src="/photo-default-article.jpg"
                alt="École de la Sainte Famille"
                class="w-40 h-auto rounded-lg"
              />
            </div>
            <p class="text-gray-400 text-sm text-center md:text-left">
              Marché de Noël organisé par l'École de la Sainte Famille
            </p>
          </div>

          <!-- Informations -->
          <div class="text-center md:text-left">
            <h5 class="text-lg font-semibold mb-4">🎄 Le Marché de Noël</h5>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li>Boutique familiale en ligne</li>
              <li>Produits de qualité</li>
              <li>Livraison gratuite</li>
              <li>Paiement sécurisé</li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="text-center md:text-left">
            <h5 class="text-lg font-semibold mb-4">📍 L'École</h5>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li>École de la Sainte Famille</li>
              <li>La Valette du Var</li>
              <li class="pt-2">
                <a href="mailto:contact@saintefamille-lavalette.fr" class="hover:text-gold-400 transition-colors">
                  contact@saintefamille-lavalette.fr
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-gray-800 pt-6 text-center">
          <p class="text-gray-400 text-sm">
            &copy; 2024 Marché de Noël - École de la Sainte Famille, La Valette du Var. Tous droits réservés.
          </p>
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

/* Glow subtil pour le logo dans le footer */
.footer-logo-glow {
  filter: drop-shadow(0 0 20px rgba(166, 124, 82, 0.3))
          drop-shadow(0 0 40px rgba(166, 124, 82, 0.15));
  transition: filter 0.3s ease;
}

.footer-logo-glow:hover {
  filter: drop-shadow(0 0 30px rgba(166, 124, 82, 0.4))
          drop-shadow(0 0 50px rgba(166, 124, 82, 0.2));
}
</style>
