<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import { useCategoryStore } from '@/stores/categories'
import ProductCard from '@/components/ProductCard.vue'
import Button from '@/components/ui/button/Button.vue'

const products = useProductStore()
const categories = useCategoryStore()
const search = ref('')
const selectedCategory = ref(null)
const sortBy = ref('newest')
const currentPage = ref(1)
const perPage = ref(9)

const filteredProducts = computed(() => {
  let result = [...products.items]
  if (selectedCategory.value) {
    result = result.filter(p => p.category_id === selectedCategory.value)
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    )
  }
  switch (sortBy.value) {
    case 'price_asc': result.sort((a, b) => a.price - b.price); break
    case 'price_desc': result.sort((a, b) => b.price - a.price); break
    case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break
    default: result.sort((a, b) => b.id - a.id)
  }
  return result
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / perPage.value))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredProducts.value.slice(start, start + perPage.value)
})

const featuredProducts = computed(() => products.items.slice(0, 4))

function getCategoryCount(catId) {
  return products.items.filter(p => p.category_id === catId).length
}

function filterByCategory(id) {
  selectedCategory.value = id
  currentPage.value = 1
}

onMounted(() => {
  products.fetchAll()
  categories.fetchAll()
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Banner -->
    <div class="relative h-[400px] mt-16 mb-8 overflow-hidden bg-gray-100">
      <img src="/uploads/hero.png?v=2" 
           alt="Магазин" 
           class="w-full h-full object-cover opacity-90" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-8">
        <h1 class="text-6xl font-bold text-white mb-4">Магазин</h1>
        <div class="flex items-center gap-4">
          <p class="text-lg text-white/80">Всё, что вам нужно</p>
          <div class="flex-1 max-w-md">
            <div class="flex bg-white rounded-full overflow-hidden">
              <input 
                v-model="search" 
                placeholder="Поиск товаров..." 
                class="flex-1 px-4 py-2.5 text-sm outline-none"
                @keyup.enter="currentPage = 1"
              />
              <button class="px-6 py-2.5 bg-black text-white text-sm font-medium">Поиск</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 pb-12">
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Sidebar Filters -->
        <aside class="w-full lg:w-64 flex-shrink-0">
          <div class="border border-gray-200 rounded-xl p-5 mb-4">
            <h3 class="font-semibold text-sm mb-4">Категории</h3>
            <div class="space-y-1">
              <button
                v-for="cat in categories.items"
                :key="cat.id"
                @click="filterByCategory(cat.id)"
                class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
                :class="selectedCategory === cat.id ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'"
              >
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                  </svg>
                  {{ cat.name }}
                </span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100">{{ getCategoryCount(cat.id) }}</span>
              </button>
              <button
                @click="selectedCategory = null; currentPage = 1"
                class="w-full px-3 py-2 rounded-lg text-sm transition-colors"
                :class="{ 'bg-black text-white': !selectedCategory, 'hover:bg-gray-50 text-gray-600': selectedCategory }"
              >
                Все товары
              </button>
            </div>
          </div>

          <div class="border border-gray-200 rounded-xl p-5">
            <h3 class="font-semibold text-sm mb-4">Фильтры</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <input type="checkbox" id="new" class="rounded border-gray-300" />
                <label for="new" class="text-sm text-gray-600">Новинки</label>
              </div>
              <div class="flex items-center gap-2">
                <input type="checkbox" id="bestseller" class="rounded border-gray-300" />
                <label for="bestseller" class="text-sm text-gray-600">Хиты продаж</label>
              </div>
              <div class="flex items-center gap-2">
                <input type="checkbox" id="discount" class="rounded border-gray-300" />
                <label for="discount" class="text-sm text-gray-600">Со скидкой</label>
              </div>
            </div>
          </div>
        </aside>

        <!-- Products Grid -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-bold">Каталог</h2>
              <span class="text-sm text-gray-400">{{ filteredProducts.length }} товаров</span>
            </div>
            <select v-model="sortBy" class="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
              <option value="newest">Сначала новые</option>
              <option value="price_asc">Цена: по возрастанию</option>
              <option value="price_desc">Цена: по убыванию</option>
              <option value="name">По названию</option>
            </select>
          </div>

          <div v-if="products.loading" class="text-center py-20 text-gray-400">
            Загрузка...
          </div>

          <div v-else-if="filteredProducts.length === 0" class="text-center py-20">
            <p class="text-4xl mb-4">🔍</p>
            <p class="text-gray-400">Товары не найдены.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
            />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              ← Назад
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              class="w-9 h-9 text-sm rounded-lg transition-colors"
              :class="currentPage === page ? 'bg-black text-white' : 'hover:bg-gray-50 border border-gray-200'"
            >
              {{ page }}
            </button>
            <button 
              @click="currentPage++" 
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Вперед →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendations Section -->
    <div class="container mx-auto px-4 py-12 border-t border-gray-100">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Рекомендации</h2>
        <div class="flex gap-2">
          <button class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">←</button>
          <button class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">→</button>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>

    <!-- CTA Section -->
    <div class="container mx-auto px-4 py-12">
      <div class="bg-gray-900 rounded-2xl p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="max-w-md">
          <h2 class="text-3xl font-bold mb-2">Готовы получить</h2>
          <h2 class="text-3xl font-bold mb-6">Наши новинки?</h2>
          <div class="flex">
            <input 
              type="email" 
              placeholder="Ваш Email" 
              class="flex-1 px-4 py-3 rounded-l-lg text-black text-sm outline-none"
            />
            <button class="px-6 py-3 bg-white text-black rounded-r-lg text-sm font-medium hover:bg-gray-100">Отправить</button>
          </div>
        </div>
        <div class="max-w-xs text-sm text-gray-300">
          <p class="font-medium mb-2">TechStore для дома и работы</p>
          <p>Мы поможем подобрать лучшую технику для ваших задач.</p>
        </div>
      </div>
    </div>
  </div>
</template>
