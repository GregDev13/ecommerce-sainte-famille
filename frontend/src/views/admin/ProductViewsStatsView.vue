<template>
  <div class="min-h-screen">
    <div class="mb-8 flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Statistiques des Vues Produits</h1>
        <p class="text-gray-600">Classement de tous les produits par nombre de vues</p>
      </div>
      <button
        @click="confirmReset"
        :disabled="loading"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
        Réinitialiser les statistiques
      </button>
    </div>

    <!-- Stats Summary Cards -->
    <div v-if="!loading && meta" class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total de Vues</p>
            <p class="text-3xl font-bold text-gray-900">{{ meta.totalViews.toLocaleString() }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Produits</p>
            <p class="text-3xl font-bold text-gray-900">{{ meta.total }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-gold-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Moyenne par Produit</p>
            <p class="text-3xl font-bold text-gray-900">{{ meta.averageViews }}</p>
          </div>
          <div class="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div class="flex gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            @input="debouncedSearch"
            type="text"
            placeholder="Rechercher un produit par nom..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
        </div>
        <button
          @click="clearSearch"
          v-if="searchQuery"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Effacer
        </button>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
        <p class="mt-2 text-gray-600">Chargement...</p>
      </div>

      <!-- Table -->
      <div v-else-if="products.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rang</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom du Produit</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prix</th>
              <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Vues</th>
              <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="(product, index) in products"
              :key="product.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Rank -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm" :class="getRankClass(getRank(index))">
                  <span v-if="getRank(index) === 1">🥇</span>
                  <span v-else-if="getRank(index) === 2">🥈</span>
                  <span v-else-if="getRank(index) === 3">🥉</span>
                  <span v-else class="text-gray-600">{{ getRank(index) }}</span>
                </div>
              </td>

              <!-- Image -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="product.image?.url" class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img :src="product.image.url" :alt="product.name" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                  📦
                </div>
              </td>

              <!-- Name -->
              <td class="px-6 py-4">
                <div class="text-sm font-semibold text-gray-900">{{ product.name }}</div>
              </td>

              <!-- Price -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ product.formattedPrice }}</div>
              </td>

              <!-- Views Count -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center gap-2">
                  <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <span class="text-lg font-bold" :class="product.viewsCount > 0 ? 'text-purple-600' : 'text-gray-400'">
                    {{ product.viewsCount }}
                  </span>
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  class="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                  :class="product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ product.isActive ? 'Actif' : 'Inactif' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 text-5xl mb-4">🔍</div>
        <p class="text-gray-600 text-lg">Aucun produit trouvé</p>
        <p class="text-gray-500 text-sm mt-2">Essayez de modifier votre recherche</p>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && products.length > 0 && meta" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Affichage de {{ (meta.currentPage - 1) * meta.perPage + 1 }} à
            {{ Math.min(meta.currentPage * meta.perPage, meta.total) }} sur
            {{ meta.total }} produits
          </div>

          <div class="flex gap-2">
            <button
              @click="goToPage(meta.currentPage - 1)"
              :disabled="meta.currentPage === 1"
              class="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Précédent
            </button>

            <div class="flex gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                class="px-4 py-2 border rounded-lg transition-colors"
                :class="page === meta.currentPage
                  ? 'bg-gold-600 text-white border-gold-600'
                  : 'bg-white border-gray-300 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="goToPage(meta.currentPage + 1)"
              :disabled="meta.currentPage === meta.lastPage"
              class="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { adminProductsApi, type ProductViewStats, type ProductViewsStatsMeta } from '@/services/adminApi'
import { useToast } from 'vue-toastification'

const toast = useToast()

const loading = ref(true)
const products = ref<ProductViewStats[]>([])
const meta = ref<ProductViewsStatsMeta | null>(null)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 20

let searchTimeout: ReturnType<typeof setTimeout>

const loadStats = async () => {
  loading.value = true
  try {
    const response = await adminProductsApi.getViewsStats({
      page: currentPage.value,
      limit: itemsPerPage,
      search: searchQuery.value
    })
    // La réponse contient directement data et meta
    products.value = response.data || []
    meta.value = response.meta || null
  } catch (error) {
    console.error('Error loading product views stats:', error)
    products.value = []
    meta.value = null
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadStats()
  }, 500)
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  loadStats()
}

const confirmReset = () => {
  if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser TOUTES les statistiques de vues ?\n\nCette action est irréversible et supprimera définitivement toutes les données de vues produits.')) {
    resetStats()
  }
}

const resetStats = async () => {
  try {
    loading.value = true
    await adminProductsApi.resetViewsStats()

    toast.success('✅ Statistiques réinitialisées avec succès', {
      timeout: 3000
    })

    // Reload stats to show 0 views
    await loadStats()
  } catch (error) {
    console.error('Error resetting stats:', error)
    toast.error('❌ Erreur lors de la réinitialisation des statistiques', {
      timeout: 3000
    })
  } finally {
    loading.value = false
  }
}

const goToPage = (page: number) => {
  if (meta.value && page >= 1 && page <= meta.value.lastPage) {
    currentPage.value = page
    loadStats()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getRank = (index: number) => {
  if (!meta.value) return index + 1
  return (meta.value.currentPage - 1) * meta.value.perPage + index + 1
}

const getRankClass = (rank: number) => {
  if (rank === 1) return 'bg-yellow-100 text-yellow-800'
  if (rank === 2) return 'bg-gray-100 text-gray-700'
  if (rank === 3) return 'bg-orange-100 text-orange-700'
  return 'bg-gray-50 text-gray-600'
}

const visiblePages = computed(() => {
  if (!meta.value) return []

  const pages: number[] = []
  const totalPages = meta.value.lastPage
  const current = meta.value.currentPage

  // Always show first page
  pages.push(1)

  // Show pages around current page
  for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
    pages.push(i)
  }

  // Always show last page if there's more than 1 page
  if (totalPages > 1) {
    pages.push(totalPages)
  }

  // Remove duplicates and sort
  return [...new Set(pages)].sort((a, b) => a - b)
})

onMounted(() => {
  loadStats()
})
</script>
