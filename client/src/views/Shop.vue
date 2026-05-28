<template>
  <div class="container mx-auto px-4 py-8 animate-fade-in">
    <!-- Header -->
    <div class="card-modern p-6 mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Каталог товаров</h1>
          <p class="text-slate-500 text-sm mt-1">{{ products.items.length }} товаров в наличии</p>
        </div>
        <div class="flex gap-3">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              v-model="search"
              @input="onSearch"
              placeholder="Поиск товаров..."
              class="w-full md:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 text-sm glass-strong focus:outline-none"
            />
          </div>
          <select
            v-model="catFilter"
            @change="onSearch"
            class="px-4 py-2.5 rounded-xl border border-slate-200/80 text-sm glass-strong focus:outline-none"
          >
            <option value="">Все категории</option>
            <option v-for="c in categories.items" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="products.loading" class="flex justify-center py-20">
      <div class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
        <p class="text-slate-500 text-sm">Загружаем товары...</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="products.items.length === 0" class="text-center py-20">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-lg font-semibold text-slate-700 mb-2">Товары не найдены</h3>
      <p class="text-slate-500">Попробуйте изменить параметры поиска</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in products.items"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import { useCategoryStore } from '@/stores/categories'
import ProductCard from '@/components/ProductCard.vue'

const products = useProductStore()
const categories = useCategoryStore()
const search = ref('')
const catFilter = ref('')

function onSearch() {
  products.fetchAll({
    q: search.value,
    category_id: catFilter.value,
  })
}

onMounted(() => {
  products.fetchAll()
  categories.fetchAll()
})
</script>
