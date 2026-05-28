<script setup>
import { ref, watch, computed } from 'vue'
import { useProductStore } from '@/stores/products'
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import Button from '@/components/ui/button/Button.vue'
import Badge from '@/components/ui/badge/Badge.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  product: { type: Object, default: null }
})

const emit = defineEmits(['update:open'])

const products = useProductStore()
const loading = ref(false)
const result = ref(null)
const error = ref('')
const selectedProductId = ref(null)
const hasCompared = ref(false)

const similarProducts = computed(() => {
  if (!props.product || !props.product.category_id) {
    console.log('AI Compare: no product or category_id')
    return []
  }
  const filtered = products.items
    .filter(p => {
      const sameCategory = p.category_id === props.product.category_id
      const notSameProduct = p.id !== props.product.id
      const hasCategory = p.category_id !== null && p.category_id !== undefined
      return sameCategory && notSameProduct && hasCategory
    })
    .slice(0, 6)
  console.log('AI Compare: similar products for category', props.product.category_id, ':', filtered.map(p => ({ id: p.id, name: p.name, cat: p.category_id })))
  return filtered
})

const selectedProduct = computed(() => {
  if (!selectedProductId.value) return null
  return products.items.find(p => p.id === selectedProductId.value)
})

async function compare(productBId) {
  console.log('compare called with:', productBId)
  if (!props.product || !productBId) return
  selectedProductId.value = productBId
  loading.value = true
  error.value = ''
  result.value = null
  hasCompared.value = true

  try {
    const res = await fetch('/api/ai/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_a_id: props.product.id,
        product_b_id: productBId
      })
    })
    const data = await res.json()
    console.log('AI response:', data)
    if (data.error) throw new Error(data.error)
    // Сервер возвращает { comparison: string }, клиент ожидает { analysis: string }
    result.value = {
      analysis: data.comparison || data.analysis || 'Нет данных для анализа',
      recommendations: data.recommendations || []
    }
  } catch (e) {
    console.error('AI error:', e)
    error.value = e.message || 'Ошибка AI сравнения'
    // fallback
    const other = selectedProduct.value
    if (other) {
      result.value = {
        analysis: `Сравнение ${props.product.name} с ${other.name}.\n\n${props.product.name}: ${props.product.price.toLocaleString('ru-RU')} ₽\n${other.name}: ${other.price.toLocaleString('ru-RU')} ₽\n\nРазница в цене: ${Math.abs(props.product.price - other.price).toLocaleString('ru-RU')} ₽.`,
        recommendations: [other.name]
      }
    }
  } finally {
    loading.value = false
  }
}

function reset() {
  selectedProductId.value = null
  result.value = null
  error.value = ''
  hasCompared.value = false
}

watch(() => props.open, (val) => {
  if (val) {
    reset()
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogHeader>
      <DialogTitle class="flex items-center gap-2">
        🤖 AI Сравнение
      </DialogTitle>
    </DialogHeader>

    <div class="space-y-4">
      <!-- Выбор товара для сравнения -->
      <div v-if="!hasCompared">
        <p class="text-sm text-muted-foreground mb-3">
          Выберите товар для сравнения с <strong>{{ product?.name }}</strong>:
        </p>

        <div v-if="similarProducts.length === 0" class="text-center py-8 text-muted-foreground">
          Нет похожих товаров в этой категории
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="p in similarProducts"
            :key="p.id"
            class="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary/60 hover:bg-muted/30 transition-colors"
          >
            <img v-if="p.image_url" :src="p.image_url" class="w-14 h-14 object-cover rounded-md flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm truncate">{{ p.name }}</p>
              <p class="text-sm text-muted-foreground">{{ p.price.toLocaleString('ru-RU') }} ₽</p>
            </div>
            <button 
              class="flex-shrink-0 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              @click.stop.prevent="compare(p.id)"
            >
              Сравнить
            </button>
          </div>
        </div>
      </div>

      <!-- Загрузка -->
      <div v-else-if="loading" class="text-center py-8">
        <p class="text-muted-foreground">Анализируем товары...⏳</p>
      </div>

      <!-- Результат сравнения -->
      <div v-else-if="result">
        <div class="flex items-center justify-between mb-4">
          <div class="text-sm">
            <span class="font-medium">{{ product?.name }}</span>
            <span class="text-muted-foreground mx-2">vs</span>
            <span class="font-medium">{{ selectedProduct?.name }}</span>
          </div>
        </div>

        <div class="bg-muted/50 rounded-lg p-4 space-y-3">
          <h3 class="font-semibold">Анализ</h3>
          <p class="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{{ result.analysis }}</p>
        </div>

        <div v-if="result.recommendations && result.recommendations.length > 0" class="space-y-2">
          <h3 class="font-semibold">Рекомендации</h3>
          <div class="flex flex-wrap gap-2">
            <Badge v-for="rec in result.recommendations" :key="rec" variant="secondary">
              {{ rec }}
            </Badge>
          </div>
        </div>

        <Button variant="outline" @click="reset" class="w-full">
          ← Сравнить с другим товаром
        </Button>
      </div>

      <div v-else-if="error" class="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
        {{ error }}
      </div>

      <div class="flex justify-end">
        <Button variant="outline" @click="$emit('update:open', false)">Закрыть</Button>
      </div>
    </div>
  </Dialog>
</template>
