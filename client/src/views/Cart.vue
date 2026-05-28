<template>
  <div class="container mx-auto px-4 py-8">
    <div class="sidebar p-6 rounded-xl mb-6">
      <h1 class="text-2xl font-bold text-white">Корзина</h1>
      <p class="text-emerald-300/60 text-sm mt-1">{{ cart.count }} товаров на сумму {{ formatPrice(cart.total) }}</p>
    </div>

    <div v-if="!auth.isLoggedIn" class="text-center py-20 sidebar rounded-xl">
      <p class="text-emerald-200/70 mb-4">Для просмотра корзины необходимо войти в аккаунт</p>
      <div class="flex gap-3 justify-center">
        <router-link to="/login" class="btn-primary px-6 py-2.5">Войти</router-link>
        <router-link to="/register" class="btn-secondary px-6 py-2.5">Регистрация</router-link>
      </div>
    </div>

    <div v-else-if="cart.loading" class="text-center py-20 text-emerald-300/60">Загрузка...</div>

    <div v-else-if="cart.items.length === 0" class="text-center py-20 sidebar rounded-xl">
      <p class="text-4xl mb-4">🛒</p>
      <p class="text-emerald-200/70">Ваша корзина пуста</p>
      <router-link to="/shop" class="btn-primary px-6 py-2.5 mt-4 inline-block">Перейти в каталог</router-link>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="item in cart.items"
        :key="item.id"
        class="sidebar p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4"
      >
        <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded-lg bg-[#ecfdf5]" />
        
        <div class="flex-1 text-center sm:text-left">
          <h3 class="font-semibold text-emerald-100">{{ item.name }}</h3>
          <p class="text-sm text-emerald-300/60">{{ formatPrice(item.price) }} × {{ item.quantity }}</p>
        </div>

        <div class="flex items-center gap-2">
          <button @click="changeQty(item.id, item.quantity - 1)" class="w-8 h-8 rounded-lg bg-emerald-800/50 text-emerald-300 hover:bg-emerald-700/50">−</button>
          <span class="w-8 text-center font-semibold">{{ item.quantity }}</span>
          <button @click="changeQty(item.id, item.quantity + 1)" class="w-8 h-8 rounded-lg bg-emerald-800/50 text-emerald-300 hover:bg-emerald-700/50">+</button>
        </div>

        <p class="font-bold text-emerald-100 w-28 text-right">{{ formatPrice(item.price * item.quantity) }}</p>

        <button @click="cart.removeItem(item.id)" class="text-red-400 hover:text-red-300 px-2">✕</button>
      </div>

      <div class="sidebar p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p class="text-sm text-emerald-300/60">Итого:</p>
          <p class="text-2xl font-bold text-white">{{ formatPrice(cart.total) }}</p>
        </div>
        <div class="flex gap-3">
          <button @click="cart.clearCart()" class="btn-secondary px-5 py-2.5 text-sm">Очистить</button>
          <button class="btn-primary px-6 py-2.5 text-sm font-bold">Оформить заказ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const auth = useAuthStore()
const cart = useCartStore()

function formatPrice(n) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(Number(n) || 0)
}

function changeQty(cartId, qty) {
  if (qty < 1) return
  cart.updateQuantity(cartId, qty)
}

onMounted(() => {
  if (auth.isLoggedIn) cart.fetchCart()
})
</script>
