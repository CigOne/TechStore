<template>
  <div class="container mx-auto px-4 py-8">
    <div class="sidebar p-6 rounded-xl mb-6">
      <h1 class="text-2xl font-bold text-white">Админ-панель</h1>
      <p class="text-emerald-300/60 text-sm mt-1">Управление магазином</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <router-link to="/admin/products" class="sidebar p-6 rounded-xl hover:bg-[#047857] transition-colors">
        <div class="text-sm text-emerald-300/60 mb-1">Товаров</div>
        <div class="text-3xl font-bold text-white">{{ productCount }}</div>
        <div class="text-sm text-emerald-300 mt-2">Управление →</div>
      </router-link>

      <router-link to="/admin/categories" class="sidebar p-6 rounded-xl hover:bg-[#047857] transition-colors">
        <div class="text-sm text-emerald-300/60 mb-1">Категорий</div>
        <div class="text-3xl font-bold text-white">{{ categoryCount }}</div>
        <div class="text-sm text-emerald-300 mt-2">Управление →</div>
      </router-link>

      <div class="sidebar p-6 rounded-xl opacity-50">
        <div class="text-sm text-emerald-300/60 mb-1">Заказов</div>
        <div class="text-3xl font-bold text-emerald-200/40">—</div>
        <div class="text-sm text-emerald-300/40 mt-2">Скоро...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '', withCredentials: true })

const productCount = ref(0)
const categoryCount = ref(0)

onMounted(async () => {
  try {
    const [p, c] = await Promise.all([
      api.get('/api/products').then(r => r.data),
      api.get('/api/categories').then(r => r.data),
    ])
    productCount.value = p.length
    categoryCount.value = c.length
  } catch (e) {}
})
</script>
