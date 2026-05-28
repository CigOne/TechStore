<script setup>
import { onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()

async function logout() {
  await auth.logout()
  // Не очищаем корзину! Сервер сохранит её при следующем входе.
  router.push('/')
}

// Загружаем корзину при входе
watch(() => auth.isLoggedIn, (val) => {
  if (val) cart.fetchCart()
})

onMounted(() => {
  if (auth.isLoggedIn) cart.fetchCart()
})
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <router-link to="/" class="text-lg font-bold tracking-tight text-black">
          TechStore
        </router-link>
        <div class="hidden md:flex items-center gap-6">
          <router-link to="/" class="text-sm text-gray-500 hover:text-black transition-colors">
            Каталог
          </router-link>
          <router-link to="/about" class="text-sm text-gray-500 hover:text-black transition-colors">
            О компании
          </router-link>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- Search -->
        <div class="hidden sm:flex items-center bg-gray-50 rounded-full px-4 py-2">
          <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input type="text" placeholder="Поиск..." class="bg-transparent text-sm outline-none w-32" />
        </div>

        <!-- Cart -->
        <router-link to="/cart" class="relative">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span v-if="auth.isLoggedIn && cart.count > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center">
            {{ cart.count > 9 ? '9+' : cart.count }}
          </span>
        </router-link>

        <div v-if="auth.isLoggedIn" class="flex items-center gap-3">
          <span class="text-sm text-gray-600 hidden sm:block">{{ auth.user?.username }}</span>
          <Button v-if="auth.isAdmin" variant="outline" size="sm" @click="router.push('/admin')">Админ</Button>
          <Button variant="ghost" size="sm" @click="logout">Выйти</Button>
        </div>
        <div v-else class="flex items-center gap-2">
          <router-link to="/login">
            <Button variant="ghost" size="sm">Вход</Button>
          </router-link>
          <router-link to="/register">
            <Button size="sm" class="bg-black text-white hover:bg-black/90">Регистрация</Button>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
