<template>
  <div class="relative overflow-hidden">
    <!-- Hero Section with animated gradient -->
    <div class="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-gold-50 via-white to-gold-100">
      <!-- Animated background blobs -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-gold-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div class="absolute top-40 left-40 w-80 h-80 bg-gold-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left content -->
          <div class="space-y-8 text-center lg:text-left">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-gold-200">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span class="text-sm font-medium text-gold-800">Boutique familiale depuis 2024</span>
            </div>

            <!-- Main heading with gradient -->
            <div>
              <h1 class="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span class="bg-gradient-to-r from-gold-700 via-gold-600 to-gold-500 bg-clip-text text-transparent">
                  Marché de Noël la Sainte Famille
                </span>
              </h1>
              <p class="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Découvrez notre sélection de produits familiaux de qualité.
                <span class="font-semibold text-gold-800">Commandez en ligne</span> ou
                <span class="font-semibold text-gold-800">réservez</span> pour récupérer en magasin.
              </p>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <router-link
                to="/products"
                class="group relative px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <span class="flex items-center justify-center gap-2">
                  Découvrir nos produits
                  <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </span>
              </router-link>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-8 pt-8">
              <div class="text-center lg:text-left">
                <div class="text-3xl font-bold text-gray-900">100+</div>
                <div class="text-sm text-gray-600 mt-1">Produits</div>
              </div>
              <div class="text-center lg:text-left">
                <div class="text-3xl font-bold text-gray-900">500+</div>
                <div class="text-sm text-gray-600 mt-1">Clients</div>
              </div>
              <div class="text-center lg:text-left">
                <div class="text-3xl font-bold text-gray-900">24h</div>
                <div class="text-sm text-gray-600 mt-1">Livraison</div>
              </div>
            </div>
          </div>

          <!-- Right content - Floating cards -->
          <div class="relative hidden lg:block">
            <div class="relative w-full h-[600px]">
              <!-- Card 1 -->
              <div class="absolute top-0 right-0 w-72 bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300 floating border border-gold-100">
                <div class="w-full h-48 bg-gradient-to-br from-gold-200 to-gold-300 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                  <img
                    v-if="recentProducts[0]?.imageUrl"
                    :src="`${API_URL}${recentProducts[0].imageUrl}`"
                    :alt="recentProducts[0].name"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-6xl">🌞</span>
                </div>
                <h3 class="font-bold text-lg text-gray-900 mb-2">Produits de qualité</h3>
                <p class="text-gray-600 text-sm">Sélection rigoureuse pour votre satisfaction</p>
                <div class="mt-4 flex items-center justify-between">
                  <span class="text-gold-700 font-bold text-xl">À partir de 5€</span>
                  <button class="w-10 h-10 bg-gold-100 hover:bg-gold-200 rounded-full flex items-center justify-center transition-colors">
                    <svg class="w-5 h-5 text-gold-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Card 2 -->
              <div class="absolute bottom-0 left-0 w-64 bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300 floating animation-delay-2000 border border-gold-100">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                    <span class="text-3xl">🛒</span>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-gray-900">98%</div>
                    <div class="text-sm text-gray-600">Satisfaction</div>
                  </div>
                </div>
                <p class="text-gray-600 text-sm">Des clients satisfaits et fidèles</p>
              </div>

              <!-- Card 3 - Small badge -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-4 floating animation-delay-4000">
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="font-semibold text-gray-700">Livraison rapide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Pourquoi nous choisir ?</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">Une expérience d'achat simple, rapide et sécurisée</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="group relative bg-gradient-to-br from-white to-gold-50 p-8 rounded-2xl border-2 border-gold-100 hover:border-gold-300 transition-all duration-300 hover:shadow-xl">
            <div class="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-3 text-gray-900">Commande en ligne</h3>
            <p class="text-gray-600 leading-relaxed">
              Commandez facilement vos produits préférés et payez en ligne de manière sécurisée avec Stripe.
            </p>
          </div>

          <div class="group relative bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-3 text-gray-900">Réservation</h3>
            <p class="text-gray-600 leading-relaxed">
              Réservez vos articles sans payer et venez les récupérer quand vous le souhaitez. Simple et pratique.
            </p>
          </div>

          <div class="group relative bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-xl">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-3 text-gray-900">Boutique familiale</h3>
            <p class="text-gray-600 leading-relaxed">
              Une boutique familiale qui privilégie la qualité et la proximité avec ses clients. Votre satisfaction d'abord.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Products Section -->
    <div class="py-24 bg-gradient-to-b from-white to-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-sm font-semibold mb-4">
            Nouveautés
          </span>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Nos derniers produits</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">Découvrez notre sélection de produits récemment ajoutés</p>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="i in 4" :key="i" class="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
            <div class="h-64 bg-gray-200"></div>
            <div class="p-6 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-full"></div>
              <div class="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <!-- Products grid -->
        <div v-else-if="recentProducts.length > 0" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="product in recentProducts" :key="product.id" class="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
            <div class="relative h-64 bg-gradient-to-br from-gold-200 to-gold-300 flex items-center justify-center overflow-hidden">
              <img
                v-if="product.imageUrl"
                :src="`${API_URL}${product.imageUrl}`"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <span v-else class="text-6xl group-hover:scale-110 transition-transform duration-300">📦</span>
              <div v-if="product.isInStock" class="absolute top-4 right-4 px-3 py-1 bg-white rounded-full text-sm font-semibold text-gold-600 shadow-md">
                Nouveau
              </div>
              <div v-else class="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold shadow-md">
                Rupture
              </div>
            </div>
            <div class="p-6">
              <h3 class="font-bold text-lg text-gray-900 mb-2 group-hover:text-gold-600 transition-colors">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description || 'Aucune description disponible' }}</p>
              <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                <span class="text-2xl font-bold text-gold-600">{{ product.formattedPrice }}</span>
                <button
                  v-if="product.isInStock"
                  @click="addToCart(product)"
                  class="w-10 h-10 bg-gold-600 hover:bg-gold-700 text-white rounded-xl flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
                <button
                  v-else
                  disabled
                  class="w-10 h-10 bg-gray-300 text-gray-500 rounded-xl flex items-center justify-center cursor-not-allowed shadow-md"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-16">
          <div class="text-6xl mb-4">📦</div>
          <p class="text-gray-600 text-lg">Aucun produit disponible pour le moment</p>
        </div>

        <div class="text-center mt-12">
          <router-link
            to="/products"
            class="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Voir tous les produits
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productsApi, type Product } from '@/services/api'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()
const cartStore = useCartStore()
const toast = useToast()

const recentProducts = ref<Product[]>([])
const loading = ref(true)

const loadRecentProducts = async () => {
  try {
    loading.value = true
    const response = await productsApi.getAll({ page: 1, limit: 4 })
    recentProducts.value = response.data.data
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error)
  } finally {
    loading.value = false
  }
}

const addToCart = (product: Product) => {
  try {
    cartStore.addItem(product)
    toast.success(`${product.name} ajouté au panier !`, {
      timeout: 2000
    })
  } catch (error: any) {
    toast.error(error.message || 'Erreur lors de l\'ajout au panier')
  }
}

onMounted(() => {
  loadRecentProducts()
})
</script>

<style scoped>
@import "tailwindcss" reference;

@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes floating {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.floating {
  animation: floating 6s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.line-clamp-2 {
  @apply overflow-hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>