<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
  modelValue: String,
  index: Number,
  disabled: Boolean,
  inputRefs: Object,
})

const emit = defineEmits(['update:modelValue'])

const input = ref()
const localValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    localValue.value = newVal
  },
)

function handleInput(event) {
  localValue.value = event.target.value
  emit('update:modelValue', localValue.value)

  if (localValue.value) {
    nextTick(() => {
      const next = document.querySelector(`[data-index='${props.index + 1}']`)
      if (next && !next.disabled) {
        next.focus()
      }
    })
  }
}

function handleBackspace(e) {
  if (!localValue.value && props.index > 0) {
    nextTick(() => {
      const prev = document.querySelector(`[data-index='${props.index - 1}']`)
      if (prev && !prev.disabled) {
        prev.focus()
      }
    })
  }
}

onMounted(() => {
  if (input.value && props.registerInput) {
    props.registerInput(input.value, props.index)
  }
})
</script>

<template>
  <input
    ref="input"
    :data-index="index"
    v-model="localValue"
    :maxlength="1"
    :disabled="disabled"
    class="guess-box"
    @input="handleInput"
    @keydown.backspace="handleBackspace"
  />
</template>

<style scoped></style>
