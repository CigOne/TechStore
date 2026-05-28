<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCategoryStore } from '@/stores/categories'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const categories = useCategoryStore()
const router = useRouter()

async function deleteCategory(id) {
  if (!confirm('Удалить категорию?')) return
  await categories.remove(id)
}

onMounted(() => {
  if (!auth.isAdmin) { router.push('/'); return }
  categories.fetchAll()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-12">
    <div class="container mx-auto px-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 class="text-2xl font-bold">Категории</h1>
        <button 
          @click="$router.push('/admin/categories/new')"
          class="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/80 transition-colors"
        >
          + Добавить категорию
        </button>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left py-4 px-6 font-semibold text-gray-500">ID</th>
                <th class="text-left py-4 px-6 font-semibold text-gray-500">Название</th>
                <th class="text-right py-4 px-6 font-semibold text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cat in categories.items" :key="cat.id" class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td class="py-4 px-6 text-gray-400 font-mono">#{{ cat.id }}</td>
                <td class="py-4 px-6 font-medium">{{ cat.name }}</td>
                <td class="py-4 px-6 text-right">
                  <button 
                    @click="$router.push(`/admin/categories/${cat.id}/edit`)"
                    class="text-gray-400 hover:text-black transition-colors mr-3"
                  >
                    ✏️
                  </button>
                  <button 
                    @click="deleteCategory(cat.id)"
                    class="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
              <tr v-if="categories.items.length === 0">
                <td colspan="3" class="text-center py-12 text-gray-400">
                  Нет категорий
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
