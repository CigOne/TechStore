<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(props.product.price)
})

// Генерируем случайный рейтинг для демо
const rating = computed(() => {
  const seed = props.product.id % 5
  return (3.5 + seed * 0.3).toFixed(1)
})

const reviewCount = computed(() => {
  return (props.product.id * 7 + 12)
})

function addToCart() {
  if (!auth.isLoggedIn) {
    router.push('/login')
    return
  }
  cart.addToCart(props.product.id, 1)
}

function buyNow() {
  addToCart()
  router.push('/cart')
}
</script>

<template>
  <div class="group">
    <!-- Image -->
    <div class="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
      <img
        v-if="product.image_url"
        :src="product.image_url"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <span class="text-4xl">📦</span>
      </div>

      <!-- Category Tag -->
      <span 
        v-if="product.category_name"
        class="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700"
      >
        {{ product.category_name }}
      </span>
    </div>

    <!-- Info -->
    <div class="space-y-2">
      <!-- Rating -->
      <div class="flex items-center gap-1.5">
        <div class="flex">
          <svg v-for="i in 5" :key="i" 
               class="w-3.5 h-3.5" 
               :class="i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'"
               fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <span class="text-xs text-gray-500">{{ rating }} ({{ reviewCount }} отзывов)</span>
      </div>

      <!-- Name -->
      <router-link :to="`/product/${product.id}`" class="block">
        <h3 class="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-1">
          {{ product.name }}
        </h3>
      </router-link>

      <!-- Price -->
      <p class="text-lg font-bold">{{ formattedPrice }}</p>

      <!-- Actions -->
      <div class="flex gap-2 pt-1">
        <button 
          @click="addToCart"
          class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
        >
          В корзину
        </button>
        <button 
          @click="buyNow"
          class="flex-1 px-3 py-2 bg-black text-white rounded-lg text-xs font-medium hover:bg-black/80 transition-colors"
        >
          Купить
        </button>
      </div>
    </div>
  </div>
</template>
