<template>
  <div class="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
    <div class="bg-[#065f46] w-full max-w-md rounded-xl border border-emerald-800/50">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">{{ category ? 'Редактировать категорию' : 'Добавить категорию' }}</h2>
          <button @click="$emit('close')" class="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-300/60 hover:text-emerald-300 hover:bg-emerald-800/50 transition-all">✕</button>
        </div>

        <form @submit.prevent="onSubmit">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-emerald-200 mb-2">Название</label>
              <input v-model="form.name" required placeholder="Смартфоны" class="w-full px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-emerald-200 mb-2">Slug</label>
              <input v-model="form.slug" required placeholder="smartfony" class="w-full px-4 py-3 text-sm font-mono"
              />
              <p class="text-xs text-emerald-300/40 mt-1">Латинские буквы, цифры и дефисы</p>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-emerald-800/50">
            <button type="button" @click="$emit('close')" class="btn-secondary px-5 py-2.5 text-sm">Отмена</button>
            <button type="submit" class="btn-primary px-6 py-2.5 text-sm font-bold">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/categories'

const props = defineProps({ category: { type: Object, default: null } })
const emit = defineEmits(['close', 'saved'])

const categories = useCategoryStore()
const form = ref({ name: '', slug: '' })

onMounted(() => {
  if (props.category) {
    form.value = { ...props.category }
  }
})

async function onSubmit() {
  if (props.category) {
    await categories.update(props.category.id, form.value)
  } else {
    await categories.create(form.value)
  }
  emit('saved')
}
</script>
