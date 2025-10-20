<template>
  <div class="min-h-screen">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

    <!-- Stats Cards -->
    <div v-if="!loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Total Produits -->
      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Produits</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalProducts }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ stats.activeProducts }} actifs</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Commandes -->
      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Commandes</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalOrders }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ stats.pendingOrders }} en attente</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- CA du mois -->
      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-gold-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">CA du mois</p>
            <p class="text-3xl font-bold text-gray-900">{{ formatPrice(stats.monthlyRevenue) }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ new Date().toLocaleDateString('fr-FR', { month: 'long' }) }}</p>
          </div>
          <div class="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Vues des produits -->
    <div v-if="!loading" class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Total Vues -->
      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Vues Produits (Total)</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalViews || 0 }}</p>
            <p class="text-xs text-gray-500 mt-1">Tous les temps</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Vues du Mois -->
      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Vues du Mois</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.monthlyViews || 0 }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ new Date().toLocaleDateString('fr-FR', { month: 'long' }) }}</p>
          </div>
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
      <p class="mt-2 text-gray-600">Chargement...</p>
    </div>

    <!-- Produits les plus vus -->
    <div v-if="!loading && topViewedProducts.length > 0" class="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Top 5 Produits les Plus Vus</h2>
      <div class="space-y-3">
        <div
          v-for="(item, index) in topViewedProducts"
          :key="item.product?.id"
          class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gold-100 text-gold-600 font-bold text-sm">
            {{ index + 1 }}
          </div>
          <div v-if="item.product?.image?.url" class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img :src="item.product.image.url" :alt="item.product.name" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
            📦
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 truncate">{{ item.product?.name }}</p>
            <p class="text-sm text-gray-600">{{ item.viewsCount }} vues</p>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span class="font-bold text-purple-600">{{ item.viewsCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div v-if="!loading && recentOrders.length > 0" class="bg-white rounded-xl shadow-sm p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Commandes récentes</h2>
      <div class="space-y-3">
        <div
          v-for="order in recentOrders"
          :key="order.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="flex-1">
            <p class="font-semibold text-gray-900">{{ order.orderNumber }}</p>
            <p class="text-sm text-gray-600">{{ order.user?.email || 'Client invité' }}</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="px-3 py-1 rounded-full text-xs font-medium" :class="getStatusClass(order.status)">
              {{ getStatusLabel(order.status) }}
            </span>
            <span class="font-bold text-gray-900">{{ Number(order.totalAmount).toFixed(2) }} €</span>
          </div>
        </div>
      </div>
      <div class="mt-4 text-center">
        <router-link to="/admin/orders" class="text-gold-600 hover:text-gold-700 font-medium text-sm">
          Voir toutes les commandes →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminDashboardApi, type DashboardStats, type Order, type TopViewedProduct } from '@/services/adminApi'

const loading = ref(true)
const stats = ref<DashboardStats>({
  totalProducts: 0,
  activeProducts: 0,
  totalOrders: 0,
  pendingOrders: 0,
  monthlyRevenue: 0,
  totalViews: 0,
  monthlyViews: 0
})
const recentOrders = ref<Order[]>([])
const topViewedProducts = ref<TopViewedProduct[]>([])

const loadDashboard = async () => {
  try {
    const response = await adminDashboardApi.getStats()
    stats.value = response.data.stats
    recentOrders.value = response.data.recentOrders
    topViewedProducts.value = response.data.topViewedProducts || []
  } catch (error) {
    console.error('Error loading dashboard:', error)
  } finally {
    loading.value = false
  }
}

const formatPrice = (price: number) => {
  return `${price.toFixed(2)} €`
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending_payment: 'bg-orange-100 text-orange-800',
    paid: 'bg-green-100 text-green-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-purple-100 text-purple-800',
    available: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending_payment: 'En attente de paiement',
    paid: 'Payée',
    preparing: 'En cours de préparation',
    ready: 'Prête',
    available: 'Disponible',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

onMounted(() => {
  loadDashboard()
})
</script>
