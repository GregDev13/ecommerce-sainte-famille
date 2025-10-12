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

      <!-- Snow particles -->
      <vue-particles
        id="tsparticles"
        :options="particlesOptions"
      />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left content -->
          <div class="space-y-8 text-center lg:text-left">
            <!-- Main heading with gradient -->
            <div>
              <h1 class="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span class="bg-gradient-to-r from-gold-700 via-gold-600 to-gold-500 bg-clip-text text-transparent">
                  Marché de Noël la Sainte Famille
                </span>
              </h1>
              <p class="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
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
          </div>

          <!-- Right content - École logo -->
          <div class="relative flex items-center justify-center mt-8 lg:mt-0">
            <div class="logo-entrance logo-glow">
              <img
                src="/photo-default-article.jpg"
                alt="École de la Sainte Famille - La Valette du Var"
                class="w-full max-w-xs sm:max-w-sm lg:max-w-lg h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 sm:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 sm:mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Pourquoi nous choisir ?</h2>
          <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Une expérience d'achat simple, rapide et sécurisée</p>
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
    <div class="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 sm:mb-16">
          <span class="inline-block px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-sm font-semibold mb-4">
            Nouveautés
          </span>
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Nos derniers produits</h2>
          <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Découvrez notre sélection de produits récemment ajoutés</p>
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
                v-if="product.image?.url"
                :src="product.image.url"
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

// tsParticles configuration
const particlesOptions = {
  background: {
    color: {
      value: 'transparent'
    }
  },
  fpsLimit: 60,
  particles: {
    color: {
      value: '#DAA520'
    },
    move: {
      direction: 'bottom' as const,
      enable: true,
      outModes: {
        default: 'out' as const
      },
      random: false,
      speed: 1,
      straight: false
    },
    number: {
      density: {
        enable: true,
        area: 800
      },
      value: 30
    },
    opacity: {
      value: { min: 0.3, max: 0.8 }
    },
    shape: {
      type: 'circle'
    },
    size: {
      value: { min: 2, max: 5 }
    },
    wobble: {
      enable: true,
      distance: 10,
      speed: 10
    }
  },
  detectRetina: true,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'repulse' as const
      }
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4
      }
    }
  }
}

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

@keyframes logo-entrance {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes gentle-pulse {
  0%, 100% {
    filter: drop-shadow(0 0 40px rgba(166, 124, 82, 0.4))
            drop-shadow(0 0 80px rgba(166, 124, 82, 0.2));
  }
  50% {
    filter: drop-shadow(0 0 60px rgba(166, 124, 82, 0.5))
            drop-shadow(0 0 100px rgba(166, 124, 82, 0.3));
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.floating {
  animation: floating 6s ease-in-out infinite;
}

.logo-entrance {
  animation: logo-entrance 1s ease-out forwards;
}

.logo-glow {
  filter: drop-shadow(0 0 40px rgba(166, 124, 82, 0.4))
          drop-shadow(0 0 80px rgba(166, 124, 82, 0.2));
  animation: gentle-pulse 4s ease-in-out infinite;
  transition: filter 0.3s ease;
}

.logo-glow:hover {
  filter: drop-shadow(0 0 60px rgba(166, 124, 82, 0.6))
          drop-shadow(0 0 100px rgba(166, 124, 82, 0.4));
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

/* tsParticles container styling */
#tsparticles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}
</style>