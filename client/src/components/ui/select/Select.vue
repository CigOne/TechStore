<script setup>
import { cn } from "@/lib/utils"

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  placeholder: { type: String, default: "" },
  class: { type: String, default: "" },
})

const emit = defineEmits(["update:modelValue"])

function onChange(e) {
  emit("update:modelValue", e.target.value)
}
</script>

<template>
  <select
    :value="modelValue"
    @change="onChange"
    :class="cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
  >
    <option value="" disabled v-if="placeholder">{{ placeholder }}</option>
    <slot />
  </select>
</template>
