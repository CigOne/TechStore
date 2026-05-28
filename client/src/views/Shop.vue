<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import { useCategoryStore } from '@/stores/categories'
import ProductCard from '@/components/ProductCard.vue'

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
  <div class="min-h-screen bg-white pt-20 pb-12">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Магазин</h1>
        <p class="text-gray-500">{{ filteredProducts.length }} товаров</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar -->
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
                <span>{{ cat.name }}</span>
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
        </aside>

        <!-- Products -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2">
              <input
                v-model="search"
                placeholder="Поиск..."
                class="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-black w-64"
                @input="currentPage = 1"
              />
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
  </div>
</template>
