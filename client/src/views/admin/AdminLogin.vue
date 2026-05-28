<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-xl bg-emerald-600 flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h1 class="text-2xl font-bold text-white">Вход</h1>
        <p class="text-emerald-300/60 text-sm mt-1">Админ-панель TechStore</p>
      </div>

      <div class="sidebar rounded-xl p-8">
        <form @submit.prevent="onSubmit">
          <div class="mb-4">
            <label class="block text-sm font-semibold text-emerald-200 mb-2">Логин</label>
            <input v-model="username" type="text" required placeholder="admin" class="w-full px-4 py-3 text-sm"
            />
          </div>
          <div class="mb-5">
            <label class="block text-sm font-semibold text-emerald-200 mb-2">Пароль</label>
            <input v-model="password" type="password" required placeholder="••••••" class="w-full px-4 py-3 text-sm"
            />
          </div>
          <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-800/50 text-sm text-red-300">{{ error }}</div>
          <button type="submit" class="w-full px-4 py-3.5 btn-primary text-sm font-bold" :disabled="loading">
            {{ loading ? 'Вход...' : 'Войти в панель' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const auth = useAuthStore()
const router = useRouter()

async function onSubmit() {
  error.value = ''
  loading.value = true
  const ok = await auth.login(username.value, password.value)
  loading.value = false
  if (ok) router.push('/admin')
  else error.value = 'Неверный логин или пароль'
}
</script>
