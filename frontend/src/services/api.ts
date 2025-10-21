import axios from 'axios'

// Configuration de base pour l'API
// Utilise la variable d'environnement VITE_API_URL définie au build
// Fallback sur localhost:3333 pour le développement local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Erreur API:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Types TypeScript
export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  isActive: boolean
  image: {
    url: string
    name: string
    size: number
    extname: string
  } | null
  formattedPrice: string
  isInStock: boolean
  createdAt: string
  updatedAt: string
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

// Order types
export interface OrderItem {
  productId: number
  quantity: number
}

export interface CreateOrderData {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  notes?: string
  paymentMethod: 'wero' | 'paypal'
  items: OrderItem[]
}

export interface Order {
  id: number
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  totalAmount: number
  status: string
  type: string
  paymentMethod: 'wero' | 'paypal'
  shippingAddress: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  orderItems?: any[]
}

// Services API
export const productsApi = {
  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return api.get('/products', { params })
  },

  async getById(id: number): Promise<ApiResponse<Product>> {
    return api.get(`/products/${id}`)
  },

  async getRelated(id: number): Promise<ApiResponse<Product[]>> {
    return api.get(`/products/${id}/related`)
  },

  async trackView(id: number): Promise<void> {
    try {
      await api.post(`/products/${id}/view`)
    } catch (error) {
      // Fail silently - tracking shouldn't disrupt UX
      console.debug('Failed to track product view:', error)
    }
  },
}

export const ordersApi = {
  async create(data: CreateOrderData): Promise<ApiResponse<Order>> {
    return api.post('/orders', data)
  },

  async getByOrderNumber(orderNumber: string): Promise<ApiResponse<Order>> {
    return api.get(`/orders/${orderNumber}`)
  },
}

export default api