<template>
  <div class="min-h-screen">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Gestion des commandes</h1>

    <!-- Filters -->
    <div class="flex gap-4 mb-6">
      <select
        v-model="statusFilter"
        @change="loadOrders(1)"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
      >
        <option value="">Tous les statuts</option>
        <option value="pending_payment">En attente de paiement</option>
        <option value="paid">Payée</option>
        <option value="preparing">En cours de préparation</option>
        <option value="ready">Prête</option>
        <option value="available">Disponible</option>
        <option value="cancelled">Annulée</option>
      </select>

      <div class="relative flex-1 max-w-md">
        <input
          v-model="orderNumberFilter"
          type="text"
          placeholder="Rechercher par n° de commande..."
          class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
        />
        <svg
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <button
          v-if="orderNumberFilter"
          @click="orderNumberFilter = ''; loadOrders(1)"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Orders Table (Desktop) -->
    <div class="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Commande</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ order.orderNumber }}</div>
              <div class="text-xs text-gray-500">{{ order.type === 'reservation' ? 'Réservation' : 'Commande' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ order.user?.email || 'Invité' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-semibold text-gray-900">{{ Number(order.totalAmount).toFixed(2) }} €</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click.stop="toggleStatusDropdown(order.id, $event)"
                class="px-4 py-2 rounded-full text-xs font-medium transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gold-500 flex items-center gap-2"
                :class="getStatusClass(order.status)"
              >
                <span>{{ getStatusLabel(order.status) }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ new Date(order.createdAt).toLocaleDateString('fr-FR') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="viewDetails(order)"
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                Détails
              </button>
              <button
                @click="deleteOrder(order)"
                class="text-red-600 hover:text-red-900"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="!loading && orders.length === 0" class="text-center py-12">
        <p class="text-gray-500">Aucune commande trouvée</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
      </div>
    </div>

    <!-- Orders Cards (Mobile) -->
    <div class="md:hidden space-y-4">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <p class="text-gray-500">Aucune commande trouvée</p>
      </div>

      <!-- Order Cards -->
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-xl shadow-sm p-4 space-y-3"
      >
        <!-- Order Header -->
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold text-gray-900">{{ order.orderNumber }}</h3>
            <p class="text-xs text-gray-500">{{ order.type === 'reservation' ? 'Réservation' : 'Commande' }}</p>
          </div>
          <button
            @click.stop="toggleStatusDropdown(order.id, $event)"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gold-500 flex items-center gap-1"
            :class="getStatusClass(order.status)"
          >
            <span>{{ getStatusLabel(order.status) }}</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        <!-- Order Info -->
        <div class="pt-3 border-t space-y-2">
          <div class="flex justify-between">
            <span class="text-xs text-gray-500">Client</span>
            <span class="text-sm font-medium text-gray-900">{{ order.user?.email || 'Invité' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-gray-500">Montant</span>
            <span class="text-sm font-semibold text-gray-900">{{ Number(order.totalAmount).toFixed(2) }} €</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-gray-500">Date</span>
            <span class="text-sm text-gray-900">{{ new Date(order.createdAt).toLocaleDateString('fr-FR') }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-3 border-t">
          <button
            @click="viewDetails(order)"
            class="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Détails
          </button>
          <button
            @click="deleteOrder(order)"
            class="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.lastPage > 1" class="mt-6 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button
          v-if="pagination.currentPage > 1"
          @click="loadOrders(pagination.currentPage - 1)"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Précédent
        </button>
        <span class="px-4 py-2 text-gray-700">
          Page {{ pagination.currentPage }} sur {{ pagination.lastPage }}
        </span>
        <button
          v-if="pagination.currentPage < pagination.lastPage"
          @click="loadOrders(pagination.currentPage + 1)"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Suivant
        </button>
      </nav>
    </div>

    <!-- Modal Details -->
    <div v-if="selectedOrder" class="fixed inset-0 bg-gold-100 bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50" @click="selectedOrder = null">
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <!-- En-tête -->
        <div class="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-8 py-6 rounded-t-xl">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-2xl font-bold mb-2">Commande {{ selectedOrder.orderNumber }}</h2>
              <p class="text-gold-100 text-sm">{{ new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
            </div>
            <button @click="selectedOrder = null" class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-8">
          <!-- Statut et Type -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-gold-50 rounded-lg p-4">
              <p class="text-sm text-gray-600 mb-1">Statut</p>
              <p class="font-semibold text-gray-900">{{ getStatusLabel(selectedOrder.status) }}</p>
            </div>
            <div class="bg-gold-50 rounded-lg p-4">
              <p class="text-sm text-gray-600 mb-1">Type</p>
              <p class="font-semibold text-gray-900">{{ selectedOrder.type === 'reservation' ? 'Réservation' : 'Commande' }}</p>
            </div>
          </div>

          <!-- Informations client et livraison -->
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <!-- Informations client -->
            <div class="border border-gray-200 rounded-lg p-5">
              <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Informations client
              </h3>
              <div class="space-y-2 text-sm">
                <p><span class="text-gray-600">Nom :</span> <span class="font-medium text-gray-900">{{ selectedOrder.customerName || 'N/A' }}</span></p>
                <p><span class="text-gray-600">Email :</span> <span class="font-medium text-gray-900">{{ selectedOrder.customerEmail || selectedOrder.user?.email || 'N/A' }}</span></p>
                <p><span class="text-gray-600">Téléphone :</span> <span class="font-medium text-gray-900">{{ selectedOrder.customerPhone || 'N/A' }}</span></p>
              </div>
            </div>

            <!-- Adresse de livraison -->
            <div class="border border-gray-200 rounded-lg p-5">
              <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Adresse de livraison
              </h3>
              <p v-if="selectedOrder.shippingAddress" class="text-sm text-gray-700 whitespace-pre-line">{{ selectedOrder.shippingAddress }}</p>
              <p v-else class="text-sm text-gray-500 italic">Aucune adresse renseignée</p>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="selectedOrder.notes" class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h3 class="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
              Commentaires du client
            </h3>
            <p class="text-sm text-gray-700">{{ selectedOrder.notes }}</p>
          </div>

          <!-- Produits commandés -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-900 mb-4 text-lg">Produits commandés</h3>
            <div v-if="selectedOrder.orderItems && selectedOrder.orderItems.length > 0" class="space-y-3">
              <div
                v-for="item in selectedOrder.orderItems"
                :key="item.id"
                class="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-gold-300 transition-colors"
              >
                <!-- Image du produit -->
                <div class="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                  <img
                    v-if="item.product?.image?.url"
                    :src="item.product.image.url"
                    :alt="item.product.name"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="flex items-center justify-center h-full text-3xl">📦</span>
                </div>

                <!-- Détails du produit -->
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900 mb-1">{{ item.product?.name || 'Produit supprimé' }}</h4>
                  <div class="flex gap-4 text-sm text-gray-600">
                    <span>Quantité : <span class="font-medium text-gray-900">{{ item.quantity }}</span></span>
                    <span>Prix unitaire : <span class="font-medium text-gray-900">{{ Number(item.unitPrice).toFixed(2) }} €</span></span>
                  </div>
                </div>

                <!-- Total ligne -->
                <div class="text-right">
                  <p class="font-semibold text-gray-900 text-lg">{{ Number(item.totalPrice).toFixed(2) }} €</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
              <p class="text-gray-500 text-sm">Aucun produit dans cette commande</p>
            </div>
          </div>

          <!-- Total -->
          <div class="border-t-2 border-gold-200 pt-4">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900">Total de la commande</span>
              <span class="text-2xl font-bold text-gold-700">{{ Number(selectedOrder.totalAmount).toFixed(2) }} €</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex gap-3 justify-end">
            <button @click="selectedOrder = null" class="btn-secondary">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dropdown de statut global (position fixed) -->
    <Teleport to="body">
      <div
        v-if="openStatusDropdown !== null && dropdownPosition"
        class="fixed w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999]"
        :style="{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`
        }"
        @click.stop
      >
        <button
          v-for="status in statusOptions"
          :key="status.value"
          @click="updateStatus(orders.find(o => o.id === openStatusDropdown)!, status.value)"
          class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3"
          :class="orders.find(o => o.id === openStatusDropdown)?.status === status.value ? 'bg-gold-50' : ''"
        >
          <span
            class="w-3 h-3 rounded-full"
            :class="status.dotClass"
          ></span>
          <span :class="orders.find(o => o.id === openStatusDropdown)?.status === status.value ? 'font-semibold text-gold-700' : 'text-gray-700'">
            {{ status.label }}
          </span>
          <svg
            v-if="orders.find(o => o.id === openStatusDropdown)?.status === status.value"
            class="w-4 h-4 ml-auto text-gold-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { adminOrdersApi, type Order } from '@/services/adminApi'
import { useToast } from 'vue-toastification'

const API_URL = import.meta.env.VITE_API_URL
const toast = useToast()

const orders = ref<Order[]>([])
const loading = ref(true)
const statusFilter = ref('')
const orderNumberFilter = ref('')
const pagination = ref<any>(null)
const selectedOrder = ref<Order | null>(null)
const openStatusDropdown = ref<number | null>(null)
const dropdownPosition = ref<{ top: number; left: number } | null>(null)

const statusOptions = [
  { value: 'pending_payment', label: 'En attente de paiement', dotClass: 'bg-orange-500' },
  { value: 'paid', label: 'Payée', dotClass: 'bg-green-500' },
  { value: 'preparing', label: 'En cours de préparation', dotClass: 'bg-blue-500' },
  { value: 'ready', label: 'Prête', dotClass: 'bg-purple-500' },
  { value: 'available', label: 'Disponible', dotClass: 'bg-emerald-500' },
  { value: 'cancelled', label: 'Annulée', dotClass: 'bg-red-500' },
]

const loadOrders = async (page = 1) => {
  try {
    loading.value = true
    const response = await adminOrdersApi.getAll({
      page,
      limit: 20,
      ...(statusFilter.value && { status: statusFilter.value }),
      ...(orderNumberFilter.value && { orderNumber: orderNumberFilter.value })
    })
    orders.value = response.data.data
    pagination.value = response.data.meta
  } catch (error) {
    console.error('Error loading orders:', error)
  } finally {
    loading.value = false
  }
}

const toggleStatusDropdown = (orderId: number, event: MouseEvent) => {
  if (openStatusDropdown.value === orderId) {
    openStatusDropdown.value = null
    dropdownPosition.value = null
  } else {
    openStatusDropdown.value = orderId

    // Calculer la position du bouton
    const button = event.currentTarget as HTMLElement
    const rect = button.getBoundingClientRect()

    dropdownPosition.value = {
      top: rect.bottom + 8,
      left: rect.left
    }
  }
}

const updateStatus = async (order: Order, newStatus: string) => {
  try {
    const response = await adminOrdersApi.updateStatus(order.id, newStatus)
    order.status = newStatus as any

    // Afficher un toast UNIQUEMENT si un email a été envoyé au client
    if ((response as any).emailSent) {
      toast.success('✅ Email de confirmation envoyé au client avec succès', {
        timeout: 5000
      })
    }

    openStatusDropdown.value = null
    dropdownPosition.value = null
  } catch (error) {
    console.error('Error updating status:', error)
    toast.error('❌ Erreur lors de la mise à jour du statut')
  }
}

const deleteOrder = async (order: Order) => {
  if (!confirm(`Supprimer la commande ${order.orderNumber} ?`)) return

  try {
    await adminOrdersApi.delete(order.id)
    orders.value = orders.value.filter(o => o.id !== order.id)
    toast.success(`Commande ${order.orderNumber} supprimée avec succès`)
  } catch (error) {
    console.error('Error deleting order:', error)
    toast.error('❌ Erreur lors de la suppression de la commande')
  }
}

const viewDetails = async (order: Order) => {
  try {
    // Charger les détails complets de la commande avec les orderItems et produits
    const response = await adminOrdersApi.show(order.id)
    selectedOrder.value = response.data
  } catch (error) {
    console.error('Error loading order details:', error)
    toast.error('❌ Erreur lors du chargement des détails de la commande')
  }
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

// Fermer le dropdown au clic ailleurs
const handleClickOutside = () => {
  openStatusDropdown.value = null
  dropdownPosition.value = null
}

// Fermer le dropdown au scroll
const handleScroll = () => {
  openStatusDropdown.value = null
  dropdownPosition.value = null
}

// Recherche avec debounce
let debounceTimeout: ReturnType<typeof setTimeout> | null = null
watch(orderNumberFilter, () => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  debounceTimeout = setTimeout(() => {
    loadOrders(1)
  }, 500)
})

onMounted(() => {
  loadOrders()
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll, true)
})
</script>
