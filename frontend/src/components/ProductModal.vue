<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen && product"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Modal Content -->
        <div
          class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- Close Button -->
          <button
            @click="closeModal"
            class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Product Image -->
          <div class="relative h-56 sm:h-72 lg:h-80 bg-gradient-to-br from-gold-200 to-gold-300 rounded-t-2xl flex items-center justify-center overflow-hidden">
            <img
              v-if="product.image?.url"
              :src="product.image.url"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-9xl">📦</span>

            <!-- Stock Badge -->
            <div
              v-if="!product.isInStock"
              class="absolute top-4 left-4 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold shadow-lg"
            >
              Rupture de stock
            </div>
            <div
              v-else-if="product.stock <= 5"
              class="absolute top-4 left-4 px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold shadow-lg"
            >
              Plus que {{ product.stock }} en stock !
            </div>
          </div>

          <!-- Product Details -->
          <div class="p-4 sm:p-6 lg:p-8">
            <!-- Title & Price -->
            <div class="mb-6">
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{{ product.name }}</h2>
              <div class="flex items-baseline gap-3">
                <span class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gold-600 to-gold-700 bg-clip-text text-transparent">
                  {{ product.formattedPrice }}
                </span>
                <span v-if="product.isInStock" class="text-sm text-green-600 font-medium">
                  ✓ En stock ({{ product.stock }} disponibles)
                </span>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-6 sm:mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p class="text-gray-600 leading-relaxed">
                {{ product.description || 'Aucune description disponible pour ce produit.' }}
              </p>
            </div>

            <!-- Quantity Selector -->
            <div v-if="product.isInStock" class="mb-6">
              <label class="block text-sm font-semibold text-gray-900 mb-2">Quantité</label>
              <div class="flex items-center gap-3">
                <button
                  @click="decrementQuantity"
                  :disabled="quantity <= 1"
                  class="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-300 hover:border-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>

                <input
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  :max="product.stock"
                  class="w-20 h-10 text-center border-2 border-gray-300 rounded-lg font-semibold focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none"
                  @input="validateQuantity"
                />

                <button
                  @click="incrementQuantity"
                  :disabled="quantity >= product.stock"
                  class="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-300 hover:border-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>

                <span class="text-sm text-gray-500 ml-2 hidden sm:inline">
                  (max: {{ product.stock }})
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                v-if="product.isInStock"
                @click="handleAddToCart"
                class="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Ajouter au panier ({{ quantity }})
              </button>

              <button
                v-else
                disabled
                class="w-full px-6 py-3 sm:py-4 bg-gray-300 text-gray-500 font-semibold rounded-xl cursor-not-allowed"
              >
                Produit indisponible
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Product } from '@/services/api'
import { productsApi } from '@/services/api'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toastification'

interface Props {
  isOpen: boolean
  product: Product | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const cartStore = useCartStore()
const toast = useToast()

const quantity = ref(1)

// Watch for product changes to reset quantity
watch(() => props.product, () => {
  quantity.value = 1
})

// Watch for isOpen to handle body scroll and track view
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'

    // Track product view with session deduplication
    if (props.product) {
      const viewKey = `viewed_product_${props.product.id}`
      const hasViewedInSession = sessionStorage.getItem(viewKey)

      if (!hasViewedInSession) {
        // Track the view
        productsApi.trackView(props.product.id)
        // Mark as viewed in this session
        sessionStorage.setItem(viewKey, 'true')
      }
    }
  } else {
    document.body.style.overflow = ''
  }
})

const closeModal = () => {
  emit('close')
}

const incrementQuantity = () => {
  if (props.product && quantity.value < props.product.stock) {
    quantity.value++
  }
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const validateQuantity = () => {
  if (!props.product) return

  if (quantity.value < 1) {
    quantity.value = 1
  } else if (quantity.value > props.product.stock) {
    quantity.value = props.product.stock
  }
}

const handleAddToCart = () => {
  if (!props.product) return

  try {
    for (let i = 0; i < quantity.value; i++) {
      cartStore.addItem(props.product)
    }
    toast.success(`${quantity.value} × ${props.product.name} ajouté${quantity.value > 1 ? 's' : ''} au panier !`, {
      timeout: 2000
    })
    closeModal()
  } catch (error: any) {
    toast.error(error.message || 'Erreur lors de l\'ajout au panier')
  }
}

// Close on Escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

// Add/remove event listener
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.9);
  opacity: 0;
}

/* Hide scrollbar for modal content but keep functionality */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #DAA520;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #B8860B;
}
</style>
