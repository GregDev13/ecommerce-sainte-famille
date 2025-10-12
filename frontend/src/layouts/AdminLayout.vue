<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center gap-3">
            <!-- Hamburger button for mobile -->
            <button
              @click="sidebarOpen = true"
              class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Ouvrir le menu"
            >
              <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            <router-link to="/admin/dashboard" class="text-xl font-bold text-gold-600">
              Admin
            </router-link>
          </div>

          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600 hidden sm:block">{{ authStore.user?.email }}</span>
            <button
              @click="handleLogout"
              class="text-sm text-gray-700 hover:text-gold-600 font-medium"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar backdrop for mobile -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sidebarOpen"
        @click="closeSidebar"
        class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
      ></div>
    </Transition>

    <div class="flex">
      <!-- Sidebar -->
      <aside
        class="fixed md:static inset-y-0 left-0 w-64 bg-white shadow-sm min-h-screen z-40 transform transition-transform duration-300 md:translate-x-0"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <!-- Sidebar header with close button (mobile only) -->
        <div class="flex items-center justify-between p-4 border-b md:hidden">
          <span class="text-lg font-bold text-gray-900">Navigation</span>
          <button
            @click="closeSidebar"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Fermer le menu"
          >
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <nav class="p-4 space-y-2">
          <router-link
            to="/admin/dashboard"
            @click="closeSidebar"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gold-50 hover:text-gold-600 transition-colors"
            active-class="bg-gold-100 text-gold-600 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </router-link>

          <router-link
            to="/admin/products"
            @click="closeSidebar"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gold-50 hover:text-gold-600 transition-colors"
            active-class="bg-gold-100 text-gold-600 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            Produits
          </router-link>

          <router-link
            to="/admin/orders"
            @click="closeSidebar"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gold-50 hover:text-gold-600 transition-colors"
            active-class="bg-gold-100 text-gold-600 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Commandes
          </router-link>

          <div class="pt-4 border-t">
            <router-link
              to="/"
              @click="closeSidebar"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Retour au site
            </router-link>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-4 md:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const sidebarOpen = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/admin/login')
}

const closeSidebar = () => {
  sidebarOpen.value = false
}
</script>

<style scoped>
@import "tailwindcss" reference;
</style>
