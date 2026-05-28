<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Sidebar -->
      <aside class="w-full lg:w-64 flex-shrink-0">
        <div class="sidebar rounded-xl p-5">
          <h3 class="text-sm font-semibold text-emerald-300 mb-4 uppercase tracking-wider">Категории</h3>
          <ul class="space-y-2">
            <li
              v-for="cat in categories.items"
              :key="cat.id"
              @click="filterByCategory(cat.id)"
              class="cursor-pointer px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between"
              :class="selectedCategory === cat.id ? 'bg-emerald-600 text-white' : 'text-emerald-200 hover:bg-emerald-800/50'"
            >
              <span>{{ cat.name }}</span>
              <span class="text-xs opacity-60">{{ getCategoryCount(cat.id) }}</span>
            </li>
            <li
              @click="selectedCategory = null; products.fetchAll()"
              class="cursor-pointer px-3 py-2.5 rounded-lg text-sm transition-colors"
              :class="!selectedCategory ? 'bg-emerald-600 text-white' : 'text-emerald-200 hover:bg-emerald-800/50'"
            >
              Все товары
            </li>
          </ul>

          <div class="mt-6 pt-6 border-t border-emerald-800/50">
            <h3 class="text-sm font-semibold text-emerald-300 mb-3 uppercase tracking-wider">Фильтр цены</h3>
            <div class="space-y-3">
              <input
                v-model.number="minPrice"
                type="number"
                placeholder="От"
                class="w-full px-3 py-2 text-sm"
              />
              <input
                v-model.number="maxPrice"
                type="number"
                placeholder="До"
                class="w-full px-3 py-2 text-sm"
              />
              <button @click="applyPriceFilter" class="w-full btn-primary py-2 text-sm">Применить</button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-2xl font-bold text-white">Каталог</h1>
            <p class="text-emerald-300/60 text-sm mt-1">{{ filteredCount }} товаров</p>
          </div>
          <div class="flex gap-3">
            <input
              v-model="search"
              @input="onSearch"
              placeholder="Поиск..."
              class="px-4 py-2.5 text-sm w-64"
            />
            <select v-model="sortBy" @change="sortProducts" class="px-4 py-2.5 text-sm">
              <option value="newest">Сначала новые</option>
              <option value="price_asc">Цена: по возрастанию</option>
              <option value="price_desc">Цена: по убыванию</option>
              <option value="name">По названию</option>
            </select>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="products.loading" class="text-center py-20 text-emerald-300/60">Загрузка...</div>

        <!-- Empty -->
        <div v-else-if="filteredProducts.length === 0" class="text-center py-20">
          <p class="text-emerald-300/60">Товары не найдены.</p>
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import { useCategoryStore } from '@/stores/categories'
import ProductCard from '@/components/ProductCard.vue'

const products = useProductStore()
const categories = useCategoryStore()
const search = ref('')
const selectedCategory = ref(null)
const minPrice = ref('')
const maxPrice = ref('')
const sortBy = ref('newest')

const filteredProducts = computed(() => {
  let result = [...products.items]

  // Category filter
  if (selectedCategory.value) {
    result = result.filter(p => p.category_id === selectedCategory.value)
  }

  // Price filter
  if (minPrice.value !== '') {
    result = result.filter(p => p.price >= minPrice.value)
  }
  if (maxPrice.value !== '') {
    result = result.filter(p => p.price <= maxPrice.value)
  }

  // Search
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    )
  }

  // Sort
  switch (sortBy.value) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'newest':
    default:
      result.sort((a, b) => b.id - a.id)
      break
  }

  return result
})

const filteredCount = computed(() => filteredProducts.value.length)

function getCategoryCount(catId) {
  return products.items.filter(p => p.category_id === catId).length
}

function filterByCategory(id) {
  selectedCategory.value = id
}

function onSearch() {
  // Search is reactive via computed
}

function applyPriceFilter() {
  // Price filter is reactive via computed
}

function sortProducts() {
  // Sort is reactive via computed
}

onMounted(() => {
  products.fetchAll()
  categories.fetchAll()
})
</script>
