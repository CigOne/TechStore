<script setup>
import { cn } from "@/lib/utils"

const props = defineProps({
  class: { type: String, default: "" },
})
</script>

<template>
  <tr :class="cn('border-b border-gray-100 transition-colors hover:bg-gray-50', props.class)">
    <slot />
  </tr>
</template>
