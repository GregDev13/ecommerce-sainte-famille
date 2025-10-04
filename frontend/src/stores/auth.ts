import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminAuthApi, type AdminUser } from '@/services/adminApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AdminUser | null>(null)
  const token = ref<string | null>(localStorage.getItem('admin_token'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(email: string, password: string) {
    try {
      const response = await adminAuthApi.login({ email, password })
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('admin_token', response.data.token)
      return true
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    }
  }

  async function logout() {
    try {
      await adminAuthApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('admin_token')
    }
  }

  async function fetchUser() {
    if (!token.value) return false

    try {
      const response = await adminAuthApi.me()
      user.value = response.data
      return true
    } catch (error) {
      // Token invalide
      token.value = null
      user.value = null
      localStorage.removeItem('admin_token')
      return false
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    fetchUser
  }
})
