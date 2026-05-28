<template>
  <nav class="fixed top-0 left-0 right-0 z-50 navbar">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <router-link to="/" class="text-lg font-bold text-white hover:text-emerald-300 transition-colors">
          TechStore
        </router-link>
        <div class="hidden md:flex items-center gap-4">
          <router-link to="/" class="text-sm text-emerald-200 hover:text-white transition-colors">
            Каталог
          </router-link>
          <router-link to="/about" class="text-sm text-emerald-200 hover:text-white transition-colors">
            О компании
          </router-link>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <!-- Cart icon -->
        <router-link to="/cart" class="relative text-emerald-200 hover:text-white transition-colors mr-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span v-if="cart.count > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 text-[#064e3b] text-[10px] font-bold rounded-full flex items-center justify-center">
            {{ cart.count > 9 ? '9+' : cart.count }}
          </span>
        </router-link>

        <div v-if="auth.isLoggedIn" class="flex items-center gap-3">
          <span class="text-sm text-emerald-300/60 hidden sm:inline">{{ auth.user?.username }}</span>
          <router-link v-if="auth.isAdmin" to="/admin" class="btn-primary px-3 py-1.5 text-xs">Админ</router-link>
          <button @click="logout" class="btn-secondary px-3 py-1.5 text-xs">Выйти</button>
        </div>
        <div v-else class="flex items-center gap-2">
          <router-link to="/login" class="text-sm text-emerald-200 hover:text-white transition-colors">Вход</router-link>
          <router-link to="/register" class="btn-primary px-4 py-2 text-sm">Регистрация</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()

async function logout() {
  await auth.logout()
  cart.items = []
  router.push('/')
}

onMounted(() => {
  if (auth.isLoggedIn) cart.fetchCart()
})
</script>
