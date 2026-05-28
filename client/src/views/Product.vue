<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="products.loading" class="text-center py-20 text-emerald-300/60">Загрузка...</div>
    
    <div v-else-if="products.item" class="flex flex-col lg:flex-row gap-8">
      <!-- Image -->
      <div class="w-full lg:w-5/12">
        <div class="aspect-square rounded-xl overflow-hidden bg-[#ecfdf5]">
          <img
            v-if="products.item.image"
            :src="products.item.image"
            :alt="products.item.name"
            class="h-full w-full object-cover"
          />
          <div v-else class="h-full w-full flex items-center justify-center">
            <span class="text-8xl">📦</span>
          </div>
        </div>
      </div>

      <!-- Info -->
      <div class="flex-1">
        <div v-if="products.item.category_name" class="tag inline-block px-3 py-1 rounded text-xs font-medium mb-4">
          {{ products.item.category_name }}
        </div>
        
        <h1 class="text-3xl font-bold text-white mb-4">{{ products.item.name }}</h1>
        <p class="text-3xl font-bold text-emerald-400 mb-6">{{ formatPrice(products.item.price) }}</p>
        <p class="text-emerald-200/80 leading-relaxed mb-6">{{ products.item.description }}</p>
        
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="sidebar p-4 rounded-lg">
            <p class="text-xs text-emerald-300/60 mb-1">В наличии</p>
            <p class="text-xl font-bold text-white">{{ products.item.stock }} шт.</p>
          </div>
          <div class="sidebar p-4 rounded-lg">
            <p class="text-xs text-emerald-300/60 mb-1">Доставка</p>
            <p class="text-xl font-bold text-white">Бесплатно</p>
          </div>
        </div>

        <!-- Add to cart section -->
        <div v-if="added" class="mb-4 p-4 rounded-lg bg-emerald-800/50 border border-emerald-600/50 text-emerald-200 flex items-center justify-between">
          <span>✅ Товар добавлен в корзину!</span>
          <router-link to="/cart" class="text-emerald-400 hover:text-emerald-300 font-semibold">Перейти →</router-link>
        </div>

        <div v-else-if="!auth.isLoggedIn" class="mb-4 p-4 rounded-lg bg-red-900/30 border border-red-800/50 text-red-300 text-sm">
          Чтобы добавить в корзину, <router-link to="/login" class="text-red-200 underline">войдите</router-link> или <router-link to="/register" class="text-red-200 underline">зарегистрируйтесь</router-link>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mb-6">
          <button 
            @click="addToCart"
            :disabled="!auth.isLoggedIn || adding"
            class="flex-1 px-6 py-3 btn-primary text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="adding">Добавляем...</span>
            <span v-else>🛒 В корзину</span>
          </button>
          <router-link to="/shop" class="px-6 py-3 btn-secondary text-base text-center">Назад в каталог</router-link>
        </div>

        <!-- AI Compare section -->
        <div class="sidebar p-5 rounded-xl">
          <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>🤖</span> AI-сравнение
          </h3>
          <p class="text-sm text-emerald-300/60 mb-4">
            Сравните этот товар с другим из категории "{{ products.item.category_name }}"
          </p>

          <div v-if="similarProducts.length > 0" class="space-y-3">
            <div
              v-for="p in similarProducts.slice(0, 4)"
              :key="p.id"
              class="flex items-center gap-3 p-3 rounded-lg bg-[#064e3b]/50 border border-emerald-800/30 cursor-pointer hover:border-emerald-600/50 transition-colors"
              @click="compareWith(p.id)"
            >
              <img :src="p.image" :alt="p.name" class="w-12 h-12 object-cover rounded bg-[#ecfdf5]" />
              <div class="flex-1">
                <p class="text-sm font-medium text-emerald-100">{{ p.name }}</p>
                <p class="text-xs text-emerald-400">{{ formatPrice(p.price) }}</p>
              </div>
              <span class="text-xs text-emerald-300/60">Сравнить →</span>
            </div>
          </div>
          <div v-else class="text-sm text-emerald-300/40">
            В этой категории пока только один товар
          </div>
        </div>
      </div>
    </div>

    <!-- AI Compare Modal -->
    <AICompareModal v-if="showCompare" @close="showCompare = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useAIStore } from '@/stores/ai'
import AICompareModal from '@/components/AICompareModal.vue'

const route = useRoute()
const products = useProductStore()
const auth = useAuthStore()
const cart = useCartStore()
const ai = useAIStore()

const adding = ref(false)
const added = ref(false)
const showCompare = ref(false)

const productId = computed(() => Number(route.params.id))

const similarProducts = computed(() => {
  if (!products.item) return []
  return products.items.filter(p => 
    p.category_id === products.item.category_id && 
    p.id !== products.item.id
  )
})

function formatPrice(n) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(Number(n) || 0)
}

async function addToCart() {
  if (!auth.isLoggedIn || !products.item) return
  adding.value = true
  try {
    await cart.addToCart(products.item.id, 1)
    added.value = true
    setTimeout(() => added.value = false, 3000)
  } catch (e) {
    console.error(e)
  } finally {
    adding.value = false
  }
}

async function compareWith(otherId) {
  showCompare.value = true
  try {
    await ai.compareProducts(products.item.id, otherId)
  } catch (e) {
    console.error('Compare failed:', e)
  }
}

function loadProduct() {
  const id = productId.value
  if (id) {
    products.fetchOne(id)
  }
}

onMounted(() => {
  loadProduct()
  products.fetchAll() // Load all products for "similar" list
})
watch(productId, () => loadProduct())
</script>
