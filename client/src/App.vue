<template>
  <div class="min-h-screen bg-white text-black">
    <AppNavbar />
    <main class="pt-16 bg-gray-50 min-h-screen">
      <router-view />
    </main>
    <footer class="mt-12 py-8 bg-gray-50 border-t border-gray-100">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <p class="font-bold mb-3">TechStore</p>
            <p class="text-sm text-gray-500">Техника для дома и работы</p>
          </div>
          <div>
            <p class="font-semibold text-sm mb-3">О нас</p>
            <ul class="space-y-2 text-sm text-gray-500">
              <li><router-link to="/about" class="hover:text-black">О компании</router-link></li>
              <li><a href="#" class="hover:text-black">Команда</a></li>
              <li><a href="#" class="hover:text-black">Контакты</a></li>
            </ul>
          </div>
          <div>
            <p class="font-semibold text-sm mb-3">Поддержка</p>
            <ul class="space-y-2 text-sm text-gray-500">
              <li><a href="#" class="hover:text-black">Доставка</a></li>
              <li><a href="#" class="hover:text-black">Возврат</a></li>
              <li><a href="#" class="hover:text-black">FAQ</a></li>
            </ul>
          </div>
          <div>
            <p class="font-semibold text-sm mb-3">Мы в соцсетях</p>
            <div class="flex gap-3">
              <a href="#" class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm hover:bg-gray-300 transition-colors">X</a>
              <a href="#" class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm hover:bg-gray-300 transition-colors">f</a>
              <a href="#" class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm hover:bg-gray-300 transition-colors">in</a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>&copy; 2026 TechStore. Все права защищены.</p>
          <div class="flex gap-4">
            <a href="#" class="hover:text-gray-600">Условия использования</a>
            <a href="#" class="hover:text-gray-600">Политика конфиденциальности</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
</script>
