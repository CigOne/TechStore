<script setup>
import { cn } from "@/lib/utils"

const props = defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  rows: { type: Number, default: 3 },
  class: { type: String, default: "" },
})

const emit = defineEmits(["update:modelValue"])

function onInput(e) {
  emit("update:modelValue", e.target.value)
}
</script>

<template>
  <textarea
    :value="modelValue"
    @input="onInput"
    :placeholder="placeholder"
    :rows="rows"
    :class="cn(
      'flex min-h-[80px] w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
  />
</template>
