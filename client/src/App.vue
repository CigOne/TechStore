<template>
  <div class="min-h-screen bg-[#064e3b] text-[#f0fdf4]">
    <AppNavbar />
    <main class="pt-16">
      <router-view />
    </main>
    <footer class="mt-12 py-6 bg-[#065f46] border-t border-emerald-800/50">
      <div class="container mx-auto px-4 text-sm text-emerald-200/60 text-center">
        <p>TechStore — Техника для жизни</p>
        <p class="mt-1 text-xs">&copy; 2026. Все права защищены.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
</script>
