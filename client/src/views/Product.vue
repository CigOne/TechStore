<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useCategoryStore } from '@/stores/categories'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import AICompareModal from '@/components/AICompareModal.vue'
import Button from '@/components/ui/button/Button.vue'

const route = useRoute()
const router = useRouter()
const products = useProductStore()
const categories = useCategoryStore()
const cart = useCartStore()
const auth = useAuthStore()
const product = ref(null)
const quantity = ref(1)
const showAI = ref(false)

const productId = Number(route.params.id)

async function loadProduct() {
  await products.fetchAll()
  product.value = products.items.find(p => p.id === productId)
}

function getCategoryName(id) {
  const cat = categories.items.find(c => c.id === id)
  return cat ? cat.name : ''
}

function addToCart() {
  if (!auth.isLoggedIn) {
    router.push('/login')
    return
  }
  cart.addToCart(product.value.id, quantity.value)
}

onMounted(() => {
  loadProduct()
  categories.fetchAll()
})
</script>

<template>
  <div class="min-h-screen bg-white pt-20">
    <div class="container mx-auto px-4 py-6">
      <Button
        variant="ghost"
        @click="$router.push('/shop')"
        class="mb-6 text-gray-500 hover:text-black"
      >
        ← Назад к каталогу
      </Button>

      <div v-if="!product" class="text-center py-20 text-gray-400">
        Загрузка...
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Image -->
        <div class="bg-gray-50 rounded-2xl overflow-hidden">
          <img
            :src="product.image_url || '/placeholder.svg'"
            :alt="product.name"
            class="w-full h-[500px] object-cover"
          />
        </div>

        <!-- Info -->
        <div class="space-y-6">
          <div>
            <span class="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 mb-3">
              {{ getCategoryName(product.category_id) }}
            </span>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
            <p class="text-3xl font-bold">{{ product.price.toLocaleString('ru-RU') }} ₽</p>
          </div>

          <div class="border-t border-b border-gray-100 py-6">
            <h3 class="font-semibold mb-3">Описание</h3>
            <p class="text-gray-600 leading-relaxed whitespace-pre-line">
              {{ product.description || 'Описание отсутствует.' }}
            </p>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-center border border-gray-200 rounded-lg">
              <button class="px-4 py-2 hover:bg-gray-50" @click="quantity = Math.max(1, quantity - 1)">-</button>
              <span class="w-10 text-center font-medium">{{ quantity }}</span>
              <button class="px-4 py-2 hover:bg-gray-50" @click="quantity++">+</button>
            </div>
            <button 
              @click="addToCart"
              class="flex-1 py-3 bg-black text-white rounded-lg font-medium hover:bg-black/80 transition-colors"
            >
              Добавить в корзину
            </button>
          </div>

          <button 
            @click="showAI = true"
            class="w-full py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            🤖 AI Сравнение
          </button>
        </div>
      </div>
    </div>

    <AICompareModal v-model:open="showAI" :product="product" />
  </div>
</template>
