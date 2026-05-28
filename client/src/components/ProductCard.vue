<template>
  <div class="card-simple overflow-hidden">
    <router-link :to="`/product/${product.id}`" class="block">
      <div class="h-48 overflow-hidden relative bg-[#ecfdf5]">
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="h-full w-full object-cover"
        />
        <div v-else class="h-full w-full flex items-center justify-center">
          <span class="text-4xl">📦</span>
        </div>
        
        <div v-if="product.category_name" class="absolute top-3 left-3 tag px-2 py-1 rounded text-xs font-medium">
          {{ product.category_name }}
        </div>
      </div>
      
      <div class="p-4">
        <h3 class="text-sm font-semibold text-slate-800 mb-2 line-clamp-1">{{ product.name }}</h3>
        <p class="text-lg font-bold text-emerald-700">{{ formatPrice(product.price) }}</p>
        <p class="text-xs text-slate-500 mt-1">В наличии: {{ product.stock }} шт.</p>
      </div>
    </router-link>
  </div>
</template>

<script setup>
const props = defineProps({ product: Object })

function formatPrice(n) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(Number(n) || 0)
}
</script>
