<template>
  <div class="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
    <div class="bg-[#065f46] w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-emerald-800/50">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🤖</span>
            <div>
              <h2 class="text-xl font-bold text-white">Сравнение товаров</h2>
              <p v-if="ai.result?.source === 'fallback'" class="text-xs text-amber-400">⚠️ Локальная нейросеть не запущена — базовое сравнение</p>
            </div>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-300/60 hover:text-emerald-300 hover:bg-emerald-800/50">✕</button>
        </div>

        <!-- Loading -->
        <div v-if="ai.comparing" class="flex flex-col items-center gap-4 py-12">
          <div class="w-8 h-8 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
          <p class="text-emerald-300/60">Нейросеть анализирует товары...</p>
          <p class="text-xs text-emerald-300/40">Это может занять 10-30 секунд</p>
        </div>

        <!-- Error -->
        <div v-else-if="ai.error" class="p-4 rounded-lg bg-red-900/30 border border-red-800/50 text-red-300 text-sm">
          {{ ai.error }}
        </div>

        <!-- Result -->
        <div v-else-if="ai.result" class="space-y-6">
          <!-- Products cards -->
          <div class="grid grid-cols-2 gap-4">
            <div class="sidebar p-4 rounded-lg text-center">
              <img :src="ai.result.product_a.image" class="w-20 h-20 object-cover rounded-lg mx-auto mb-3 bg-[#ecfdf5]">
              <p class="font-semibold text-emerald-100 text-sm">{{ ai.result.product_a.name }}</p>
              <p class="text-emerald-400 font-bold">{{ formatPrice(ai.result.product_a.price) }}</p>
            </div>
            <div class="sidebar p-4 rounded-lg text-center">
              <img :src="ai.result.product_b.image" class="w-20 h-20 object-cover rounded-lg mx-auto mb-3 bg-[#ecfdf5]">
              <p class="font-semibold text-emerald-100 text-sm">{{ ai.result.product_b.name }}</p>
              <p class="text-emerald-400 font-bold">{{ formatPrice(ai.result.product_b.price) }}</p>
            </div>
          </div>

          <!-- Comparison text -->
          <div class="sidebar p-5 rounded-lg">
            <div class="text-emerald-200/90 text-sm leading-relaxed whitespace-pre-line">{{ ai.result.comparison }}</div>
          </div>

          <!-- Ollama hint -->
          <div v-if="ai.result.source === 'fallback'" class="p-4 rounded-lg bg-amber-900/20 border border-amber-800/50 text-amber-300/80 text-xs">
            <p class="font-semibold mb-1">💡 Хотите умное сравнение от нейросети?</p>
            <p>1. Установите Ollama: <a href="https://ollama.com" target="_blank" class="text-amber-400 underline">ollama.com</a></p>
            <p>2. В PowerShell: <code class="bg-amber-900/40 px-1 rounded">ollama pull qwen2.5:7b</code></p>
            <p>3. Запустите: <code class="bg-amber-900/40 px-1 rounded">ollama run qwen2.5:7b</code></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAIStore } from '@/stores/ai'

const ai = useAIStore()

function formatPrice(n) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(Number(n) || 0)
}
</script>
