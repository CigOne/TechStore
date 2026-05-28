<template>
  <div class="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
    <div class="bg-[#065f46] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-emerald-800/50">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">{{ product ? 'Редактировать товар' : 'Добавить товар' }}</h2>
          <button @click="$emit('close')" class="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-300/60 hover:text-emerald-300 hover:bg-emerald-800/50 transition-all">✕</button>
        </div>

        <form @submit.prevent="onSubmit">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-emerald-200 mb-2">Название</label>
              <input v-model="form.name" required placeholder="Apple iPhone 16 Pro" class="w-full px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-emerald-200 mb-2">Slug</label>
              <input v-model="form.slug" required placeholder="iphone-16-pro" class="w-full px-4 py-3 text-sm font-mono"
              />
              <p class="text-xs text-emerald-300/40 mt-1">Латинские буквы, цифры и дефисы</p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-emerald-200 mb-2">Описание</label>
              <textarea v-model="form.description" rows="3" placeholder="Краткое описание..." class="w-full px-4 py-3 text-sm resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-emerald-200 mb-2">Цена (₽)</label>
                <input v-model.number="form.price" type="number" step="0.01" required placeholder="99900" class="w-full px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-emerald-200 mb-2">Наличие (шт.)</label>
                <input v-model.number="form.stock" type="number" required placeholder="10" class="w-full px-4 py-3 text-sm"
                />
              </div>
            </div>

            <!-- Image Upload -->
            <div>
              <label class="block text-sm font-semibold text-emerald-200 mb-2">Изображение</label>
              
              <!-- Preview existing or selected image -->
              <div v-if="previewUrl" class="mb-3">
                <div class="relative w-32 h-32 rounded-lg overflow-hidden bg-[#ecfdf5]">
                  <img :src="previewUrl" class="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    @click="clearImage"
                    class="absolute top-1 right-1 w-6 h-6 rounded bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500"
                  >✕</button>
                </div>
              </div>

              <!-- URL input for external links -->
              <div class="mb-2">
                <input 
                  v-model="form.image" 
                  placeholder="Или вставьте URL картинки..." 
                  class="w-full px-4 py-3 text-sm font-mono text-xs"
                  @input="onUrlInput"
                />
              </div>

              <!-- File upload area -->
              <div 
                class="relative border-2 border-dashed border-emerald-800/50 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-600/50 transition-colors"
                @click="$refs.fileInput.click()"
                @dragover.prevent
                @drop.prevent="handleDrop"
              >
                <input 
                  ref="fileInput"
                  type="file" 
                  accept="image/*" 
                  class="hidden"
                  @change="handleFileChange"
                />
                <div v-if="!selectedFile">
                  <p class="text-emerald-300/60 text-sm">📁 Нажмите или перетащите картинку сюда</p>
                  <p class="text-xs text-emerald-300/40 mt-1">JPG, PNG, WebP — до 5 МБ</p>
                </div>
                <div v-else class="text-emerald-300">
                  <p class="text-sm">✅ {{ selectedFile.name }}</p>
                  <p class="text-xs text-emerald-300/60">{{ Math.round(selectedFile.size / 1024) }} КБ</p>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-emerald-200 mb-2">Категория</label>
              <select v-model="form.category_id" class="w-full px-4 py-3 text-sm bg-[#064e3b]">
                <option :value="null">Без категории</option>
                <option v-for="cat in categories.items" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-emerald-800/50">
            <button type="button" @click="$emit('close')" class="btn-secondary px-5 py-2.5 text-sm">Отмена</button>
            <button 
              type="submit" 
              class="btn-primary px-6 py-2.5 text-sm font-bold flex items-center gap-2"
              :disabled="uploading"
            >
              <span v-if="uploading">⏳ Загрузка файла...</span>
              <span v-else>Сохранить</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useProductStore } from '@/stores/products'
import { useCategoryStore } from '@/stores/categories'

const props = defineProps({ product: { type: Object, default: null } })
const emit = defineEmits(['close', 'saved'])

const products = useProductStore()
const categories = useCategoryStore()

const form = ref({
  name: '',
  slug: '',
  description: '',
  price: 0,
  image: '',
  stock: 0,
  category_id: null,
})

const selectedFile = ref(null)
const previewUrl = ref('')
const uploading = ref(false)

// Set preview from existing product image
onMounted(() => {
  categories.fetchAll()
  if (props.product) {
    form.value = { ...props.product }
    if (props.product.image) {
      previewUrl.value = props.product.image
    }
  }
})

// Watch for image URL changes from input
watch(() => form.value.image, (newUrl) => {
  if (newUrl && !selectedFile.value) {
    previewUrl.value = newUrl
  }
})

function onUrlInput() {
  if (form.value.image) {
    selectedFile.value = null
    previewUrl.value = form.value.image
  }
}

function handleFileChange(e) {
  const file = e.target.files[0]
  if (file) selectFile(file)
}

function handleDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file) selectFile(file)
}

function selectFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Пожалуйста, выберите изображение')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('Файл слишком большой (макс. 5 МБ)')
    return
  }
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  form.value.image = '' // Clear URL when file selected
}

function clearImage() {
  selectedFile.value = null
  previewUrl.value = ''
  form.value.image = ''
  if ($refs.fileInput) $refs.fileInput.value = ''
}

async function uploadFile() {
  if (!selectedFile.value) return form.value.image || ''
  
  const data = new FormData()
  data.append('image', selectedFile.value)
  
  const res = await axios.post('/api/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  })
  
  return res.data.url
}

async function onSubmit() {
  uploading.value = true
  try {
    // Upload file first if selected
    if (selectedFile.value) {
      const imageUrl = await uploadFile()
      form.value.image = imageUrl
    }
    
    if (props.product) {
      await products.update(props.product.id, form.value)
    } else {
      await products.create(form.value)
    }
    emit('saved')
  } catch (e) {
    console.error('Save failed:', e)
    alert(e?.response?.data?.error || 'Ошибка сохранения')
  } finally {
    uploading.value = false
  }
}
</script>
