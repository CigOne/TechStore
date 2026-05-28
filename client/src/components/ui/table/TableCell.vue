<script setup>
import { cn } from "@/lib/utils"

const props = defineProps({
  class: { type: String, default: "" },
})
</script>

<template>
  <td :class="cn('p-3 align-middle text-sm', props.class)">
    <slot />
  </td>
</template>
