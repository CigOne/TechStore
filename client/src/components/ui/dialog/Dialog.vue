<script setup>
import { cn } from "@/lib/utils"
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  open: { type: Boolean, default: false },
  class: { type: String, default: "" },
})

const emit = defineEmits(["update:open"])
const localOpen = ref(props.open)

watch(() => props.open, (val) => { localOpen.value = val })
watch(localOpen, (val) => { emit("update:open", val) })

function close() { localOpen.value = false }

onMounted(() => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && localOpen.value) close()
  })
})
</script>

<template>
  <Teleport to="body">
    <div v-if="localOpen" class="fixed inset-0 z-50 pointer-events-none">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black/60 pointer-events-auto" @click="close"></div>
      
      <!-- Content -->
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div :class="cn('relative w-full max-w-2xl rounded-xl border bg-card p-6 text-card-foreground shadow-lg pointer-events-auto', props.class)">
          <button 
            @click="close"
            class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 pointer-events-auto"
          >✕</button>
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
