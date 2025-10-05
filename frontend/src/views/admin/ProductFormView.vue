<template>
  <div class="min-h-screen max-w-2xl">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
      {{ isEdit ? 'Modifier le produit' : 'Nouveau produit' }}
    </h1>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          v-model="form.description"
          rows="4"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Prix (€) *</label>
          <input
            v-model.number="form.price"
            type="number"
            step="0.01"
            required
            min="0"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
          <input
            v-model.number="form.stock"
            type="number"
            required
            min="0"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Image du produit</label>

        <!-- Preview de l'image existante -->
        <div v-if="imagePreview || existingImage" class="mb-4">
          <img
            :src="imagePreview || existingImage"
            alt="Preview"
            class="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
          />
        </div>

        <!-- Input file -->
        <input
          type="file"
          accept="image/*"
          @change="handleImageChange"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100"
        />
        <p class="text-xs text-gray-500 mt-1">JPG, PNG, GIF jusqu'à 5MB</p>
      </div>

      <div class="flex items-center">
        <input
          v-model="form.isActive"
          type="checkbox"
          id="isActive"
          class="w-4 h-4 text-gold-600 border-gray-300 rounded focus:ring-gold-500"
        />
        <label for="isActive" class="ml-2 text-sm text-gray-700">
          Produit actif (visible sur le site)
        </label>
      </div>

      <div class="flex gap-4 pt-4">
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 bg-gold-600 hover:bg-gold-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer' }}
        </button>
        <router-link
          to="/admin/products"
          class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
        >
          Annuler
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { adminProductsApi } from '@/services/adminApi'

const toast = useToast()
const API_URL = import.meta.env.VITE_API_URL

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)

const form = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  isActive: true
})

const imagePreview = ref<string | null>(null)
const existingImage = ref<string | null>(null)
const selectedFile = ref<File | null>(null)

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    selectedFile.value = file
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const loadProduct = async () => {
  if (!isEdit.value) return

  try {
    const response = await adminProductsApi.getById(Number(route.params.id))
    form.value = {
      name: response.data.name,
      description: response.data.description || '',
      price: response.data.price,
      stock: response.data.stock,
      isActive: response.data.isActive
    }

    // Load existing image if available
    if (response.data.image?.url) {
      existingImage.value = `${API_URL}${response.data.image.url}`
    }
  } catch (error) {
    console.error('Error loading product:', error)
    alert('Produit introuvable')
    router.push('/admin/products')
  }
}

const handleSubmit = async () => {
  loading.value = true

  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('description', form.value.description)
    formData.append('price', form.value.price.toString())
    formData.append('stock', form.value.stock.toString())
    formData.append('isActive', form.value.isActive.toString())

    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    if (isEdit.value) {
      await adminProductsApi.update(Number(route.params.id), formData)
      toast.success('Produit mis à jour avec succès')
    } else {
      await adminProductsApi.create(formData)
      toast.success('Produit créé avec succès')
    }
    router.push('/admin/products')
  } catch (error: any) {
    console.error('Error saving product:', error)
    toast.error('Erreur lors de l\'enregistrement')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProduct()
})
</script>
