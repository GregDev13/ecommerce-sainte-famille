<template>
  <div class="min-h-screen">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Gestion des produits</h1>
      <router-link
        to="/admin/products/new"
        class="px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        + Nouveau produit
      </router-link>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher un produit..."
        @input="searchProducts"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
      />
    </div>

    <!-- Products Table (Desktop) -->
    <div class="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                  <img
                    v-if="product.image?.url"
                    :src="product.image.url"
                    :alt="product.name"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-xl">📦</span>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">{{ product.description?.substring(0, 50) }}...</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 font-semibold">{{ Number(product.price).toFixed(2) }} €</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ product.stock }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="toggleActive(product)"
                :class="product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
              >
                {{ product.isActive ? 'Actif' : 'Inactif' }}
              </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <router-link
                :to="`/admin/products/${product.id}/edit`"
                class="text-blue-600 hover:text-blue-900"
              >
                Modifier
              </router-link>
              <button
                @click="deleteProduct(product)"
                class="text-red-600 hover:text-red-900"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="!loading && products.length === 0" class="text-center py-12">
        <p class="text-gray-500">Aucun produit trouvé</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
      </div>
    </div>

    <!-- Products Cards (Mobile) -->
    <div class="md:hidden space-y-4">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <p class="text-gray-500">Aucun produit trouvé</p>
      </div>

      <!-- Product Cards -->
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-xl shadow-sm p-4 space-y-3"
      >
        <!-- Product Header -->
        <div class="flex gap-3">
          <div class="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              v-if="product.image?.url"
              :src="product.image.url"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-3xl">📦</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 truncate">{{ product.name }}</h3>
            <p class="text-sm text-gray-500 line-clamp-2">{{ product.description }}</p>
          </div>
        </div>

        <!-- Product Info -->
        <div class="grid grid-cols-2 gap-3 pt-3 border-t">
          <div>
            <p class="text-xs text-gray-500">Prix</p>
            <p class="font-semibold text-gray-900">{{ Number(product.price).toFixed(2) }} €</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Stock</p>
            <p class="font-semibold text-gray-900">{{ product.stock }}</p>
          </div>
        </div>

        <!-- Status & Actions -->
        <div class="flex items-center justify-between pt-3 border-t">
          <button
            @click="toggleActive(product)"
            :class="product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            class="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
          >
            {{ product.isActive ? 'Actif' : 'Inactif' }}
          </button>
          <div class="flex gap-2">
            <router-link
              :to="`/admin/products/${product.id}/edit`"
              class="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              Modifier
            </router-link>
            <button
              @click="deleteProduct(product)"
              class="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.lastPage > 1" class="mt-6 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button
          v-if="pagination.currentPage > 1"
          @click="loadProducts(pagination.currentPage - 1)"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Précédent
        </button>
        <span class="px-4 py-2 text-gray-700">
          Page {{ pagination.currentPage }} sur {{ pagination.lastPage }}
        </span>
        <button
          v-if="pagination.currentPage < pagination.lastPage"
          @click="loadProducts(pagination.currentPage + 1)"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Suivant
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminProductsApi } from '@/services/adminApi'

const API_URL = import.meta.env.VITE_API_URL

const products = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')
const pagination = ref<any>(null)

const loadProducts = async (page = 1) => {
  try {
    loading.value = true
    const response = await adminProductsApi.getAll({
      page,
      limit: 20,
      ...(searchQuery.value && { search: searchQuery.value })
    })
    products.value = response.data.data
    pagination.value = response.data.meta
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
}

const searchProducts = () => {
  setTimeout(() => loadProducts(1), 500)
}

const toggleActive = async (product: any) => {
  try {
    await adminProductsApi.toggleActive(product.id)
    product.isActive = !product.isActive
  } catch (error) {
    console.error('Error toggling product:', error)
  }
}

const deleteProduct = async (product: any) => {
  if (!confirm(`Supprimer "${product.name}" ?`)) return

  try {
    await adminProductsApi.delete(product.id)
    products.value = products.value.filter(p => p.id !== product.id)
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Erreur lors de la suppression')
  }
}

onMounted(() => {
  loadProducts()
})
</script>
