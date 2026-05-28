<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/categories'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const categories = useCategoryStore()
const auth = useAuthStore()

const isEdit = ref(!!route.params.id)
const loading = ref(false)
const error = ref('')
const name = ref('')

watch(() => route.params.id, async (id) => {
  if (id) {
    isEdit.value = true
    await categories.fetchAll()
    const cat = categories.items.find(c => c.id === Number(id))
    if (cat) name.value = cat.name
  } else {
    isEdit.value = false
    name.value = ''
  }
}, { immediate: true })

async function save() {
  error.value = ''
  if (!name.value.trim()) {
    error.value = 'Введите название'
    return
  }
  loading.value = true
  try {
    if (isEdit.value) {
      await categories.update(Number(route.params.id), { name: name.value })
    } else {
      await categories.create({ name: name.value })
    }
    router.push('/admin/categories')
  } catch (e) {
    error.value = e.message || 'Ошибка сохранения'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!auth.isAdmin) { router.push('/'); return }
  if (route.params.id) {
    categories.fetchAll().then(() => {
      const cat = categories.items.find(c => c.id === Number(route.params.id))
      if (cat) name.value = cat.name
    })
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-12">
    <div class="container mx-auto px-4">
      <button 
        @click="$router.push('/admin/categories')"
        class="mb-6 text-sm text-gray-500 hover:text-black transition-colors"
      >
        ← Назад к категориям
      </button>

      <div class="max-w-lg mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-xl font-bold">{{ isEdit ? 'Редактировать категорию' : 'Новая категория' }}</h2>
        </div>

        <div class="p-6 space-y-5">
          <div v-if="error" class="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {{ error }}
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Название *</label>
            <input 
              v-model="name" 
              placeholder="Например: Смартфоны"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        <div class="p-6 border-t border-gray-100 flex gap-3">
          <button 
            @click="$router.push('/admin/categories')"
            class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button 
            @click="save"
            :disabled="loading"
            class="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/80 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Сохранение...' : (isEdit ? 'Сохранить' : 'Создать') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
