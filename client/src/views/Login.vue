<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = 'Заполните все поля'
    return
  }
  loading.value = true
  const success = await auth.login(username.value, password.value)
  loading.value = false
  if (success) {
    await cart.fetchCart() // Загружаем корзину с сервера
    router.push('/')
  } else {
    error.value = auth.error || 'Ошибка входа'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold mb-2">Вход</h1>
        <p class="text-sm text-gray-500">Войдите в свой аккаунт</p>
      </div>

      <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
        {{ error }}
      </div>

      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Логин</label>
          <input 
            v-model="username" 
            placeholder="ivan_ivanov" 
            class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-colors"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Пароль</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••" 
            class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-colors"
          />
        </div>

        <button 
          @click="login"
          :disabled="loading"
          class="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-black/80 transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>

        <p class="text-center text-sm text-gray-500">
          Нет аккаунта?
          <router-link to="/register" class="text-black font-medium hover:underline">Зарегистрироваться</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
