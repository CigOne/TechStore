<template>
  <div class="container mx-auto px-4 py-8">
    <div class="sidebar p-6 rounded-xl mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Товары</h1>
          <p class="text-emerald-300/60 text-sm">Управление ассортиментом</p>
        </div>
        <button @click="openCreate" class="btn-primary px-5 py-2.5 text-sm">Добавить товар</button>
      </div>
    </div>

    <div v-if="products.loading" class="text-center py-20 text-emerald-300/60">Загрузка...</div>
    
    <div v-else class="sidebar rounded-xl overflow-hidden">
      <div class="p-4 border-b border-emerald-800/50">
        <input
          v-model="searchQuery"
          placeholder="Поиск товаров по названию, категории, ID..."
          class="w-full px-4 py-2.5 text-sm"
        />
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="table-header">
              <th class="text-left py-4 px-6">#ID</th>
              <th class="text-left py-4 px-6">Товар</th>
              <th class="text-left py-4 px-6">Категория</th>
              <th class="text-left py-4 px-6">Цена</th>
              <th class="text-left py-4 px-6">Наличие</th>
              <th class="text-right py-4 px-6">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id" class="table-row">
              <td class="py-4 px-6 text-emerald-300/60 font-mono text-xs">#{{ product.id }}</td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-[#ecfdf5] flex-shrink-0">
                    <img v-if="product.image" :src="product.image" alt="" class="w-full h-full object-cover">
                    <span v-else class="text-xs flex items-center justify-center h-full">📦</span>
                  </div>
                  <span class="font-medium text-emerald-100">{{ product.name }}</span>
                </div>
              </td>
              <td class="py-4 px-6">
                <span v-if="product.category_name" class="tag px-2.5 py-1 rounded text-xs font-medium">{{ product.category_name }}</span>
                <span v-else class="text-emerald-300/40">—</span>
              </td>
              <td class="py-4 px-6 font-semibold text-emerald-100">{{ formatPrice(product.price) }}</td>
              <td class="py-4 px-6">
                <span 
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="product.stock > 5 ? 'text-green-300 bg-green-900/30' : product.stock > 0 ? 'text-amber-300 bg-amber-900/30' : 'text-red-300 bg-red-900/30'"
                >
                  {{ product.stock }} шт.
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <button @click="openEdit(product)" class="text-emerald-300/60 hover:text-emerald-300 transition-colors mr-3 text-xs">Редактировать</button>
                <button @click="remove(product.id)" class="text-emerald-300/40 hover:text-red-400 transition-colors text-xs">Удалить</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredProducts.length === 0" class="text-center py-8 text-emerald-300/40 text-sm">
          Ничего не найдено
        </div>
      </div>
    </div>

    <ProductForm v-if="showForm" :product="editingProduct" @close="showForm = false" @saved="onSaved" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import ProductForm from '@/components/admin/ProductForm.vue'

const products = useProductStore()
const showForm = ref(false)
const editingProduct = ref(null)
const searchQuery = ref('')

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.items
  const q = searchQuery.value.toLowerCase()
  return products.items.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.category_name && p.category_name.toLowerCase().includes(q)) ||
    String(p.id).includes(q)
  )
})

function formatPrice(n) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(Number(n) || 0)
}

function openCreate() {
  editingProduct.value = null
  showForm.value = true
}
function openEdit(product) {
  editingProduct.value = product
  showForm.value = true
}
function onSaved() {
  showForm.value = false
  products.fetchAll()
}
async function remove(id) {
  if (!confirm('Удалить товар?')) return
  await products.remove(id)
  products.fetchAll()
}

onMounted(() => products.fetchAll())
</script>
