<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  isRunning: Boolean, // parent controls when it starts/stops
  resetTrigger: Number, // force reset on change (can be a timestamp)
})

const emit = defineEmits(['update:seconds'])
const seconds = ref(0)
let intervalId = null

const formattedTime = computed(() => {
  const mins = String(Math.floor(seconds.value / 60)).padStart(2, '0')
  const secs = String(seconds.value % 60).padStart(2, '0')
  return `${mins}:${secs}`
})

watch(
  () => props.isRunning,
  (running) => {
    if (running) {
      intervalId = setInterval(() => {
        seconds.value++
        emit('update:seconds', seconds.value)
      }, 1000)
    } else {
      clearInterval(intervalId)
    }
  },
)

watch(
  () => props.resetTrigger,
  () => {
    seconds.value = 0
    clearInterval(intervalId)
  },
)

onUnmounted(() => clearInterval(intervalId))
</script>

<template>
  <div class="timer">{{ formattedTime }}</div>
</template>

<style scoped>
.timer {
  font-size: 1.5rem;
  color: #84ce00;
  text-align: center;
  margin-top: 1rem;
}
</style>
