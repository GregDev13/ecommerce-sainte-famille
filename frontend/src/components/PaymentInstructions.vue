 sp<template>
  <div v-if="instructions" class="bg-gradient-to-br from-gold-50 to-gold-100 border-2 border-gold-400 rounded-2xl p-6 sm:p-8 shadow-lg">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-12 h-12 bg-gradient-to-br from-gold-600 to-gold-700 rounded-full flex items-center justify-center text-white text-2xl">
        {{ paymentMethod === 'wero' ? '🏦' : '💳' }}
      </div>
      <div>
        <h3 class="text-2xl font-bold text-gray-900">{{ instructions.title }}</h3>
        <p class="text-sm text-gray-600">Finalisez votre commande</p>
      </div>
    </div>

    <!-- Instructions Alert -->
    <div class="bg-white border-l-4 border-gold-600 rounded-lg p-4 mb-6">
      <p class="font-semibold text-gray-900 mb-3">Pour finaliser votre commande, suivez ces étapes :</p>
      <ul class="space-y-2">
        <li v-for="(instruction, index) in instructions.instructions" :key="index" class="flex items-start gap-2">
          <span class="text-gold-600 font-bold">{{ index + 1 }}.</span>
          <span class="text-gray-700">{{ instruction }}</span>
        </li>
      </ul>
    </div>

    <!-- Payment Details - Wero -->
    <div v-if="paymentMethod === 'wero'" class="bg-white rounded-xl p-6 shadow-sm space-y-4">
      <div class="grid gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-600 mb-1">Email Wero</label>
          <div class="flex items-center gap-2">
            <input
              type="text"
              :value="instructions.email"
              readonly
              class="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none"
            />
            <button
              @click="copyToClipboard(instructions.email)"
              class="px-4 py-3 bg-gold-600 hover:bg-gold-700 text-white rounded-lg transition-colors"
              title="Copier l'email"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-600 mb-1">Bénéficiaire</label>
          <input
            type="text"
            :value="instructions.accountHolder"
            readonly
            class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
      </div>
    </div>

    <!-- Payment Details - PayPal -->
    <div v-else-if="paymentMethod === 'paypal'" class="bg-white rounded-xl p-6 shadow-sm space-y-4">
      <div class="grid gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-600 mb-1">Email PayPal</label>
          <div class="flex items-center gap-2">
            <input
              type="text"
              :value="instructions.email"
              readonly
              class="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none"
            />
            <button
              @click="copyToClipboard(instructions.email)"
              class="px-4 py-3 bg-gold-600 hover:bg-gold-700 text-white rounded-lg transition-colors"
              title="Copier l'email"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Reference -->
    <div class="mt-6 bg-orange-50 border-2 border-orange-400 rounded-xl p-6">
      <div class="flex items-start gap-3">
        <svg class="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <div class="flex-1">
          <p class="font-bold text-orange-900 mb-2">IMPORTANT : N'oubliez pas la référence !</p>
          <p class="text-sm text-orange-800 mb-3">Indiquez cette référence dans le libellé de votre paiement pour que nous puissions identifier votre commande :</p>
          <div class="flex items-center gap-2">
            <div class="flex-1 px-4 py-3 bg-white border-2 border-orange-400 rounded-lg font-mono text-lg font-bold text-orange-900">
              {{ orderNumber }}
            </div>
            <button
              @click="copyToClipboard(orderNumber)"
              class="px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              title="Copier la référence"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

interface PaymentInstructions {
  title: string
  instructions: string[]
  email?: string
  accountHolder?: string
}

interface Props {
  paymentMethod: 'wero' | 'paypal'
  orderNumber: string
}

const props = defineProps<Props>()
const toast = useToast()

const instructions = ref<PaymentInstructions | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const fetchInstructions = async () => {
  loading.value = true
  error.value = null

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1'
    const response = await fetch(`${apiUrl}/payment-instructions/${props.paymentMethod}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors du chargement des instructions')
    }

    instructions.value = data.data
  } catch (err: any) {
    error.value = err.message
    toast.error('Impossible de charger les instructions de paiement')
  } finally {
    loading.value = false
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Copié dans le presse-papier !', { timeout: 2000 })
  } catch (err) {
    toast.error('Impossible de copier')
  }
}

onMounted(() => {
  fetchInstructions()
})
</script>
