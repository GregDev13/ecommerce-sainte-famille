import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: {
    url: string
  }
  stock: number
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])

  // Load from localStorage on init
  const loadCart = () => {
    const savedCart = localStorage.getItem('soleil_cart')
    if (savedCart) {
      try {
        items.value = JSON.parse(savedCart)
      } catch (e) {
        console.error('Error loading cart from localStorage:', e)
      }
    }
  }

  // Save to localStorage
  const saveCart = () => {
    localStorage.setItem('soleil_cart', JSON.stringify(items.value))
  }

  // Getters
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  const cartItems = computed(() => items.value)

  // Actions
  const addItem = (product: any) => {
    const existingItem = items.value.find(item => item.id === product.id)

    if (existingItem) {
      // Check stock before increasing quantity
      if (existingItem.quantity < product.stock) {
        existingItem.quantity++
      } else {
        throw new Error('Stock insuffisant')
      }
    } else {
      // Add new item
      items.value.push({
        id: product.id,
        name: product.name,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        quantity: 1,
        image: product.image,
        stock: product.stock
      })
    }

    saveCart()
  }

  const removeItem = (productId: number) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveCart()
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else if (quantity <= item.stock) {
        item.quantity = quantity
        saveCart()
      } else {
        throw new Error('Stock insuffisant')
      }
    }
  }

  const clearCart = () => {
    items.value = []
    saveCart()
  }

  // Initialize
  loadCart()

  return {
    items,
    itemCount,
    totalPrice,
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
})
