<template>
  <div class="container mx-auto px-4 py-8">
    <div class="sidebar p-6 rounded-xl mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Категории</h1>
          <p class="text-emerald-300/60 text-sm">Управление категориями</p>
        </div>
        <button @click="openCreate" class="btn-primary px-5 py-2.5 text-sm">Добавить категорию</button>
      </div>
    </div>

    <div v-if="categories.loading" class="text-center py-20 text-emerald-300/60">Загрузка...</div>
    
    <div v-else class="sidebar rounded-xl overflow-hidden">
      <div class="p-4 border-b border-emerald-800/50">
        <input
          v-model="searchQuery"
          placeholder="Поиск категорий по названию, slug, ID..."
          class="w-full px-4 py-2.5 text-sm"
        />
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="table-header">
              <th class="text-left py-4 px-6">#ID</th>
              <th class="text-left py-4 px-6">Название</th>
              <th class="text-left py-4 px-6">Slug</th>
              <th class="text-right py-4 px-6">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in filteredCategories" :key="cat.id" class="table-row">
              <td class="py-4 px-6 text-emerald-300/60 font-mono text-xs">#{{ cat.id }}</td>
              <td class="py-4 px-6 font-medium text-emerald-100">{{ cat.name }}</td>
              <td class="py-4 px-6">
                <code class="text-xs bg-[#064e3b] px-2 py-1 rounded text-emerald-300/60">{{ cat.slug }}</code>
              </td>
              <td class="py-4 px-6 text-right">
                <button @click="openEdit(cat)" class="text-emerald-300/60 hover:text-emerald-300 transition-colors mr-3 text-xs">Редактировать</button>
                <button @click="remove(cat.id)" class="text-emerald-300/40 hover:text-red-400 transition-colors text-xs">Удалить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <CategoryForm v-if="showForm" :category="editingCategory" @close="showForm = false" @saved="onSaved" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/categories'
import CategoryForm from '@/components/admin/CategoryForm.vue'

const categories = useCategoryStore()
const showForm = ref(false)
const editingCategory = ref(null)
const searchQuery = ref('')

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.items
  const q = searchQuery.value.toLowerCase()
  return categories.items.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.slug.toLowerCase().includes(q) ||
    String(c.id).includes(q)
  )
})

function openCreate() {
  editingCategory.value = null
  showForm.value = true
}
function openEdit(cat) {
  editingCategory.value = cat
  showForm.value = true
}
function onSaved() {
  showForm.value = false
  categories.fetchAll()
}
async function remove(id) {
  if (!confirm('Удалить категорию?')) return
  await categories.remove(id)
  categories.fetchAll()
}

onMounted(() => categories.fetchAll())
</script>
