<template>
  <div class="relative overflow-hidden min-h-screen">
    <!-- Snow particles -->
    <vue-particles
      id="tsparticles"
      :options="particlesOptions"
    />

    <div class="max-w-6xl mx-auto py-8 px-4 relative z-10">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Nos Produits</h1>

      <!-- Filtres et recherche -->
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un produit..."
            class="w-full px-4 py-2 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent bg-white"
            @input="searchProducts"
          />
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
      <p class="mt-2 text-gray-600">Chargement des produits...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 mb-4">❌</div>
      <p class="text-red-600">{{ error }}</p>
      <button @click="() => loadProducts()" class="btn-primary mt-4">Réessayer</button>
    </div>

    <!-- Products grid -->
    <div v-else class="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        @click="openProductModal(product)"
        class="card p-4 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <!-- Product image -->
        <div class="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          <img
            v-if="product.image?.url"
            :src="product.image.url"
            :alt="product.name"
            class="h-full w-full object-cover rounded-lg"
          />
          <span v-else class="text-4xl">📦</span>
        </div>

        <!-- Product info -->
        <h3 class="font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ product.description }}</p>

        <!-- Price and stock -->
        <div class="flex justify-between items-center mb-3">
          <span class="text-lg font-bold text-gold-700">{{ product.formattedPrice }}</span>
          <span
            :class="product.isInStock ? 'text-green-600' : 'text-red-600'"
            class="text-xs"
          >
            {{ product.isInStock ? `En stock (${product.stock})` : 'Rupture' }}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            v-if="product.isInStock"
            @click="addToCart(product, $event)"
            class="btn-primary flex-1 text-sm py-2"
            title="Ajout rapide au panier"
          >
            🛒 Ajouter
          </button>
          <button
            v-else
            disabled
            class="bg-gray-300 text-gray-500 flex-1 text-sm py-2 px-4 rounded-lg cursor-not-allowed"
          >
            Indisponible
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && !error && products.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
      <p class="text-gray-600">Essayez de modifier vos critères de recherche.</p>
    </div>

    <!-- Infinite scroll loader -->
    <div v-if="loading && products.length > 0" class="mt-8 text-center py-4">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
      <p class="mt-2 text-gray-600 text-sm">Chargement des produits...</p>
    </div>

    <!-- All products loaded message -->
    <div v-if="!loading && allProductsLoaded && products.length > 0" class="mt-8 text-center py-4">
      <p class="text-gray-500 text-sm">✨ Tous les produits ont été chargés</p>
    </div>

    <!-- Product Detail Modal -->
    <ProductModal
      :is-open="isModalOpen"
      :product="selectedProduct"
      @close="closeProductModal"
    />
    </div>

    <!-- Footer (only shown when all products are loaded) -->
    <footer v-if="allProductsLoaded && products.length > 0" class="bg-gray-900 text-white py-8 mt-12 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center space-y-4">
          <!-- Logo -->
          <div class="flex justify-center mb-4">
            <img
              src="/photo-default-article.jpg"
              alt="École de la Sainte Famille"
              class="w-32 h-auto rounded-lg opacity-80"
            />
          </div>

          <!-- Contact info -->
          <div class="text-sm text-gray-400 space-y-2">
            <p class="font-semibold text-white">Marché de Noël - École de la Sainte Famille</p>
            <p>101 Av. du Char Verdun, 83160 La Valette-du-Var</p>
            <div class="space-y-1">
              <p>
                <span class="text-gray-500">École :</span>
                <a href="mailto:secretariat@ecolestefamillelavalette.org" class="hover:text-gold-400 transition-colors">
                  secretariat@ecolestefamillelavalette.org
                </a>
              </p>
              <p>
                <span class="text-gray-500">Support boutique :</span>
                <a href="mailto:support@boutiquesaintefamille.fr" class="hover:text-gold-400 transition-colors">
                  support@boutiquesaintefamille.fr
                </a>
              </p>
            </div>
          </div>

          <!-- Copyright -->
          <div class="pt-4 border-t border-gray-800">
            <p class="text-gray-500 text-xs">
              &copy; {{ new Date().getFullYear() }} Marché de Noël - École de la Sainte Famille. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { productsApi, type Product } from '@/services/api'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toastification'
import ProductModal from '@/components/ProductModal.vue'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()
const cartStore = useCartStore()
const toast = useToast()

// Reactive data
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const pagination = ref<any>(null)
const selectedProduct = ref<Product | null>(null)
const isModalOpen = ref(false)
const currentPage = ref(1)
const allProductsLoaded = ref(false)
const isLoadingMore = ref(false)

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

// Methods
const loadProducts = async (page = 1, append = false) => {
  // Prevent loading if already loading or all products loaded
  if (loading.value || (append && allProductsLoaded.value)) return

  try {
    loading.value = true
    error.value = ''

    const params = {
      page,
      limit: 12,
      ...(searchQuery.value && { search: searchQuery.value })
    }

    const response = await productsApi.getAll(params)

    if (append) {
      // Append new products to existing list (infinite scroll)
      products.value = [...products.value, ...response.data.data]
    } else {
      // Replace products (initial load or search)
      products.value = response.data.data
    }

    pagination.value = response.data.meta
    currentPage.value = page

    // Check if we've loaded all products
    if (page >= response.data.meta.lastPage) {
      allProductsLoaded.value = true
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erreur lors du chargement des produits'
    console.error('Erreur lors du chargement des produits:', err)
  } finally {
    loading.value = false
    isLoadingMore.value = false
  }
}

const searchProducts = () => {
  setTimeout(() => {
    // Reset for new search
    currentPage.value = 1
    allProductsLoaded.value = false
    isLoadingMore.value = false
    loadProducts(1, false)
  }, 500) // Debounce
}

// Infinite scroll handler
const handleScroll = () => {
  // Protection 1: Prevent multiple simultaneous loads
  if (isLoadingMore.value || allProductsLoaded.value || loading.value) return

  // Protection 2: Check if page is scrollable (prevent infinite loop on short pages)
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight

  if (scrollHeight <= clientHeight) return

  // Check if user is near bottom of page (100px from bottom)
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    // Load next page if available
    if (pagination.value && currentPage.value < pagination.value.lastPage) {
      isLoadingMore.value = true
      loadProducts(currentPage.value + 1, true)
    }
  }
}

const addToCart = (product: Product, event?: Event) => {
  // Stop event propagation to prevent opening modal when clicking quick add button
  if (event) {
    event.stopPropagation()
  }

  try {
    cartStore.addItem(product)
    toast.success(`${product.name} ajouté au panier !`, {
      timeout: 2000
    })
  } catch (error: any) {
    toast.error(error.message || 'Erreur lors de l\'ajout au panier')
  }
}

const openProductModal = (product: Product) => {
  selectedProduct.value = product
  isModalOpen.value = true
}

const closeProductModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedProduct.value = null
  }, 300) // Wait for animation to finish
}

// Lifecycle
onMounted(() => {
  // Reset flags to ensure clean state
  isLoadingMore.value = false
  allProductsLoaded.value = false
  currentPage.value = 1

  loadProducts()
  // Attach scroll event listener for infinite scroll
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  // Clean up scroll event listener
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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