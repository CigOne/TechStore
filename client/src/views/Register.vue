<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

async function register() {
  error.value = ''
  if (!name.value || !email.value || !password.value) {
    error.value = 'Заполните все поля'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Пароли не совпадают'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Пароль минимум 6 символов'
    return
  }
  loading.value = true
  const success = await auth.register(name.value, password.value, email.value)
  loading.value = false
  if (success) {
    await cart.fetchCart() // Загружаем корзину с сервера
    router.push('/')
  } else {
    error.value = auth.error || 'Ошибка регистрации'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold mb-2">Регистрация</h1>
        <p class="text-sm text-gray-500">Создайте новый аккаунт</p>
      </div>

      <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
        {{ error }}
      </div>

      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Имя</label>
          <input 
            v-model="name" 
            placeholder="Иван Иванов" 
            class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-colors"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="you@example.com" 
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

        <div class="space-y-2">
          <label class="text-sm font-medium">Повторите пароль</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            placeholder="••••••" 
            class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-colors"
          />
        </div>

        <button 
          @click="register"
          :disabled="loading"
          class="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-black/80 transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>

        <p class="text-center text-sm text-gray-500">
          Уже есть аккаунт?
          <router-link to="/login" class="text-black font-medium hover:underline">Войти</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
