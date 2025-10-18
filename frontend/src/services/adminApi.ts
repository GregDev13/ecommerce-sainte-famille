import axios from 'axios'

// Utilise la variable d'environnement VITE_API_URL définie au build
// Fallback sur localhost:3333 pour le développement local
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1'
const API_URL = `${BASE_API_URL}/admin`

const adminApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur pour les réponses
adminApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Erreur API Admin:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Types TypeScript
export interface AdminUser {
  id: number
  email: string
  fullName: string | null
  role: 'admin' | 'client'
}

export interface DashboardStats {
  totalProducts: number
  activeProducts: number
  totalOrders: number
  pendingOrders: number
  monthlyRevenue: number
}

export interface Order {
  id: number
  orderNumber: string
  userId: number | null
  customerName: string
  customerEmail: string
  customerPhone: string
  totalAmount: number
  status: 'pending' | 'reserved' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  type: 'order' | 'reservation'
  stripePaymentIntentId: string | null
  shippingAddress: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    email: string
    fullName: string | null
  }
  orderItems?: OrderItem[]
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  unitPrice: number
  totalPrice: number
  product?: {
    id: number
    name: string
    price: number
    image: {
      url: string
      name: string
    } | null
  }
}

export interface ApiResponse<T> {
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
    firstPageUrl: string
    lastPageUrl: string
    nextPageUrl: string | null
    previousPageUrl: string | null
  }
}

// Services API Admin

// Auth
export const adminAuthApi = {
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: AdminUser; token: string }>> {
    return adminApi.post('/login', credentials)
  },

  async logout(): Promise<ApiResponse<void>> {
    return adminApi.post('/logout')
  },

  async me(): Promise<ApiResponse<AdminUser>> {
    return adminApi.get('/me')
  }
}

// Dashboard
export const adminDashboardApi = {
  async getStats(): Promise<ApiResponse<{ stats: DashboardStats; recentOrders: Order[] }>> {
    return adminApi.get('/dashboard')
  }
}

// Products
export const adminProductsApi = {
  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<ApiResponse<PaginatedResponse<any>>> {
    return adminApi.get('/products', { params })
  },

  async getById(id: number): Promise<ApiResponse<any>> {
    return adminApi.get(`/products/${id}`)
  },

  async create(data: FormData): Promise<ApiResponse<any>> {
    return adminApi.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  async update(id: number, data: FormData): Promise<ApiResponse<any>> {
    return adminApi.put(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return adminApi.delete(`/products/${id}`)
  },

  async toggleActive(id: number): Promise<ApiResponse<any>> {
    return adminApi.patch(`/products/${id}/toggle`)
  }
}

// Orders
export const adminOrdersApi = {
  async getAll(params?: {
    page?: number
    limit?: number
    status?: string
    orderNumber?: string
  }): Promise<ApiResponse<PaginatedResponse<Order>>> {
    return adminApi.get('/orders', { params })
  },

  async getById(id: number): Promise<ApiResponse<Order>> {
    return adminApi.get(`/orders/${id}`)
  },

  async show(id: number): Promise<ApiResponse<Order>> {
    return adminApi.get(`/orders/${id}`)
  },

  async updateStatus(id: number, status: string): Promise<ApiResponse<Order>> {
    return adminApi.patch(`/orders/${id}/status`, { status })
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return adminApi.delete(`/orders/${id}`)
  }
}

export default adminApi
