<script setup>
import { cn } from "@/lib/utils"

const props = defineProps({
  class: { type: String, default: "" },
})
</script>

<template>
  <th :class="cn('h-10 px-4 text-left align-middle font-semibold text-black text-xs uppercase tracking-wider bg-gray-50 border-b border-gray-200', props.class)">
    <slot />
  </th>
</template>
