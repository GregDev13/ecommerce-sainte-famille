<template>
  <div class="min-h-screen max-w-6xl mx-auto py-8 px-4">
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
        class="card p-4 hover:shadow-lg transition-shadow"
      >
        <!-- Product image -->
        <div class="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          <img
            v-if="product.imageUrl"
            :src="product.imageUrl"
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
            @click="addToCart(product)"
            class="btn-primary flex-1 text-sm py-2"
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

    <!-- Pagination -->
    <div v-if="pagination && pagination.lastPage > 1" class="mt-8 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button
          v-if="pagination.currentPage > 1"
          @click="loadPage(pagination.currentPage - 1)"
          class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Précédent
        </button>

        <span class="px-4 py-2 text-gray-700">
          Page {{ pagination.currentPage }} sur {{ pagination.lastPage }}
        </span>

        <button
          v-if="pagination.currentPage < pagination.lastPage"
          @click="loadPage(pagination.currentPage + 1)"
          class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Suivant
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productsApi, type Product } from '@/services/api'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toastification'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()
const cartStore = useCartStore()
const toast = useToast()

// Reactive data
const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const pagination = ref<any>(null)

// Methods
const loadProducts = async (page = 1) => {
  try {
    loading.value = true
    error.value = ''

    const params = {
      page,
      limit: 12,
      ...(searchQuery.value && { search: searchQuery.value })
    }

    const response = await productsApi.getAll(params)
    products.value = response.data.data
    pagination.value = response.data.meta
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erreur lors du chargement des produits'
    console.error('Erreur lors du chargement des produits:', err)
  } finally {
    loading.value = false
  }
}

const searchProducts = () => {
  setTimeout(() => loadProducts(1), 500) // Debounce
}

const loadPage = (page: number) => {
  loadProducts(page)
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

// Lifecycle
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>