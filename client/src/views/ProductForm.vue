<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useCategoryStore } from '@/stores/categories'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const products = useProductStore()
const categories = useCategoryStore()
const auth = useAuthStore()

const isEdit = ref(!!route.params.id)
const loading = ref(false)
const error = ref('')
const uploadError = ref('')

const form = ref({
  name: '',
  description: '',
  price: '',
  category_id: '',
  stock: 0,
  image_url: ''
})

const imageFile = ref(null)
const imagePreview = ref('')

watch(() => route.params.id, async (id) => {
  if (id) {
    isEdit.value = true
    await loadProduct(id)
  } else {
    isEdit.value = false
    resetForm()
  }
}, { immediate: true })

async function loadProduct(id) {
  await products.fetchAll()
  const p = products.items.find(x => x.id === Number(id))
  if (p) {
    form.value = {
      name: p.name,
      description: p.description || '',
      price: p.price,
      category_id: p.category_id,
      stock: p.stock || 0,
      image_url: p.image_url || ''
    }
    imagePreview.value = p.image_url || ''
  }
}

function resetForm() {
  form.value = { name: '', description: '', price: '', category_id: '', stock: 0, image_url: '' }
  imageFile.value = null
  imagePreview.value = ''
}

function onImageChange(e) {
  const file = e.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Выберите изображение'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = 'Максимум 5 МБ'
    return
  }
  uploadError.value = ''
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

async function uploadImage() {
  if (!imageFile.value) return form.value.image_url
  const data = new FormData()
  data.append('image', imageFile.value)
  const res = await fetch('/api/upload', { method: 'POST', body: data })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Ошибка загрузки')
  return json.url
}

async function save() {
  error.value = ''
  if (!form.value.name || !form.value.price || !form.value.category_id) {
    error.value = 'Заполните обязательные поля'
    return
  }
  loading.value = true
  try {
    const imageUrl = await uploadImage()
    const data = { ...form.value, price: Number(form.value.price), category_id: Number(form.value.category_id), image_url: imageUrl }
    if (isEdit.value) {
      await products.update(Number(route.params.id), data)
    } else {
      await products.create(data)
    }
    router.push('/admin/products')
  } catch (e) {
    error.value = e.message || 'Ошибка сохранения'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!auth.isAdmin) { router.push('/'); return }
  categories.fetchAll()
  if (route.params.id) loadProduct(route.params.id)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-12">
    <div class="container mx-auto px-4">
      <button 
        @click="$router.push('/admin/products')"
        class="mb-6 text-sm text-gray-500 hover:text-black transition-colors"
      >
        ← Назад к товарам
      </button>

      <div class="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-xl font-bold">{{ isEdit ? 'Редактировать товар' : 'Новый товар' }}</h2>
        </div>

        <div class="p-6 space-y-5">
          <div v-if="error" class="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {{ error }}
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Название *</label>
            <input 
              v-model="form.name" 
              placeholder="iPhone 15 Pro"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-colors"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Описание</label>
            <textarea 
              v-model="form.description" 
              placeholder="Описание товара..."
              rows="4"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-colors resize-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Цена *</label>
              <input 
                v-model.number="form.price" 
                type="number"
                placeholder="99900"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-colors"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Остаток</label>
              <input 
                v-model.number="form.stock" 
                type="number"
                placeholder="10"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Категория *</label>
            <select 
              v-model="form.category_id"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-colors bg-white"
            >
              <option value="" disabled>Выберите категорию</option>
              <option v-for="cat in categories.items" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Изображение</label>
            <div v-if="imagePreview" class="mb-3">
              <img :src="imagePreview" class="w-32 h-32 object-cover rounded-lg border border-gray-200" />
            </div>
            <input 
              type="file" 
              accept="image/*" 
              @change="onImageChange"
              class="w-full text-sm file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-colors"
            />
            <p v-if="uploadError" class="text-sm text-red-500">{{ uploadError }}</p>
          </div>
        </div>

        <div class="p-6 border-t border-gray-100 flex gap-3">
          <button 
            @click="$router.push('/admin/products')"
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
