<script setup>
import { computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'

const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()

const total = computed(() => cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0))

async function updateQuantity(cartId, qty) {
  if (qty <= 0) {
    await cart.removeFromCart(cartId)
  } else {
    await cart.updateCartItem(cartId, qty)
  }
}

async function remove(cartId) {
  await cart.removeFromCart(cartId)
}

async function clear() {
  if (confirm('Очистить корзину?')) {
    await cart.clearCart()
  }
}

onMounted(() => {
  if (!auth.isLoggedIn) {
    router.push('/login')
  }
})
</script>

<template>
  <div class="min-h-screen bg-white pt-20">
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold mb-6">Корзина</h1>

      <div v-if="cart.items.length === 0" class="text-center py-20">
        <p class="text-6xl mb-4">🛒</p>
        <p class="text-lg font-medium mb-2">Корзина пуста</p>
        <p class="text-gray-400 mb-4">Добавьте товары из каталога</p>
        <Button @click="$router.push('/shop')">В каталог</Button>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-8">
        <!-- Items -->
        <div class="flex-1 space-y-4">
          <div
            v-for="item in cart.items"
            :key="item.id"
            class="flex gap-4 p-4 border border-gray-100 rounded-xl"
          >
            <img
              :src="item.image_url || item.image || '/placeholder.svg'"
              :alt="item.name"
              class="w-24 h-24 object-cover rounded-lg"
            />
            <div class="flex-1">
              <router-link
                :to="`/product/${item.product_id || item.id}`"
                class="font-medium hover:text-gray-600 transition-colors"
              >
                {{ item.name }}
              </router-link>
              <p class="text-sm text-gray-400">{{ item.price.toLocaleString('ru-RU') }} ₽</p>

              <div class="flex items-center gap-3 mt-3">
                <button 
                  class="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  @click="updateQuantity(item.id, item.quantity - 1)"
                >-</button>
                <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                <button 
                  class="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  @click="updateQuantity(item.id, item.quantity + 1)"
                >+</button>
                <button 
                  class="ml-auto text-sm text-red-500 hover:text-red-700"
                  @click="remove(item.id)"
                >
                  Удалить
                </button>
              </div>
            </div>

            <div class="text-right">
              <p class="font-semibold">{{ (item.price * item.quantity).toLocaleString('ru-RU') }} ₽</p>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="w-full lg:w-80">
          <div class="border border-gray-100 rounded-xl p-6">
            <h3 class="font-semibold mb-4">Итого</h3>
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Товары ({{ cart.count }})</span>
                <span>{{ total.toLocaleString('ru-RU') }} ₽</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Доставка</span>
                <span class="text-green-600">Бесплатно</span>
              </div>
              <div class="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
                <span>Всего</span>
                <span>{{ total.toLocaleString('ru-RU') }} ₽</span>
              </div>
            </div>
            <button class="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-black/80 transition-colors mb-3">
              Оформить заказ
            </button>
            <button 
              class="w-full py-3 text-sm text-red-500 hover:text-red-700 transition-colors"
              @click="clear"
            >
              Очистить корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
