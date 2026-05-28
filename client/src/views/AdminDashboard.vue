<script setup>
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/products'
import { useCategoryStore } from '@/stores/categories'
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const products = useProductStore()
const categories = useCategoryStore()
const router = useRouter()

const totalProducts = computed(() => products.items.length)
const totalCategories = computed(() => categories.items.length)
const lowStock = computed(() => products.items.filter(p => (p.stock || 0) <= 5).length)

onMounted(() => {
  if (!auth.isAdmin) {
    router.push('/')
    return
  }
  products.fetchAll()
  categories.fetchAll()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-12">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-8">Панель управления</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Stat Card -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <p class="text-sm text-gray-500 mb-2">Товары</p>
          <p class="text-4xl font-bold text-black mb-4">{{ totalProducts }}</p>
          <button 
            @click="$router.push('/admin/products')"
            class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-black hover:bg-gray-50 transition-colors"
          >
            Управлять товарами →
          </button>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <p class="text-sm text-gray-500 mb-2">Категории</p>
          <p class="text-4xl font-bold text-black mb-4">{{ totalCategories }}</p>
          <button 
            @click="$router.push('/admin/categories')"
            class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Управлять категориями →
          </button>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <p class="text-sm text-gray-500 mb-2">Заканчиваются</p>
          <p class="text-4xl font-bold mb-4" :class="lowStock > 0 ? 'text-red-600' : ''">{{ lowStock }}</p>
          <span 
            v-if="lowStock > 0"
            class="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium"
          >
            Требует внимания
          </span>
          <span 
            v-else
            class="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium"
          >
            Всё в порядке
          </span>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <h2 class="font-semibold mb-4">Быстрые действия</h2>
        <div class="flex flex-wrap gap-3">
          <button 
            @click="$router.push('/admin/products/new')"
            class="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/80 transition-colors"
          >
            + Добавить товар
          </button>
          <button 
            @click="$router.push('/admin/categories/new')"
            class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            + Добавить категорию
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
