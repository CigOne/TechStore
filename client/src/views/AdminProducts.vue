<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/products'
import { useCategoryStore } from '@/stores/categories'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const products = useProductStore()
const categories = useCategoryStore()
const router = useRouter()
const search = ref('')
const categoryFilter = ref('')

const filtered = computed(() => {
  let result = [...products.items]
  if (categoryFilter.value) {
    result = result.filter(p => p.category_id === Number(categoryFilter.value))
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q))
  }
  return result.sort((a, b) => b.id - a.id)
})

function getCategoryName(id) {
  const cat = categories.items.find(c => c.id === id)
  return cat ? cat.name : '—'
}

async function deleteProduct(id) {
  if (!confirm('Удалить товар?')) return
  await products.remove(id)
}

onMounted(() => {
  if (!auth.isAdmin) { router.push('/'); return }
  products.fetchAll()
  categories.fetchAll()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-12">
    <div class="container mx-auto px-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 class="text-2xl font-bold">Товары</h1>
        <button 
          @click="$router.push('/admin/products/new')"
          class="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/80 transition-colors"
        >
          + Добавить товар
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <input 
            v-model="search" 
            placeholder="Поиск..." 
            class="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-black"
          />
          <select 
            v-model="categoryFilter" 
            class="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white"
          >
            <option value="">Все категории</option>
            <option v-for="cat in categories.items" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left py-4 px-6 font-semibold text-gray-500">ID</th>
                <th class="text-left py-4 px-6 font-semibold text-gray-500">Название</th>
                <th class="text-left py-4 px-6 font-semibold text-gray-500">Категория</th>
                <th class="text-left py-4 px-6 font-semibold text-gray-500">Цена</th>
                <th class="text-left py-4 px-6 font-semibold text-gray-500">Остаток</th>
                <th class="text-right py-4 px-6 font-semibold text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in filtered" :key="p.id" class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td class="py-4 px-6 text-gray-400 font-mono">#{{ p.id }}</td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <img v-if="p.image_url" :src="p.image_url" class="w-10 h-10 object-cover rounded-lg" />
                    <span class="font-medium">{{ p.name }}</span>
                  </div>
                </td>
                <td class="py-4 px-6 text-gray-500">{{ getCategoryName(p.category_id) }}</td>
                <td class="py-4 px-6 font-medium">{{ p.price.toLocaleString('ru-RU') }} ₽</td>
                <td class="py-4 px-6">
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="(p.stock || 0) <= 5 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ p.stock || 0 }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right">
                  <button 
                    @click="$router.push(`/admin/products/${p.id}/edit`)"
                    class="text-gray-400 hover:text-black transition-colors mr-3"
                  >
                    ✏️
                  </button>
                  <button 
                    @click="deleteProduct(p.id)"
                    class="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
              <tr v-if="filtered.length === 0">
                <td colspan="6" class="text-center py-12 text-gray-400">
                  Товары не найдены
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
