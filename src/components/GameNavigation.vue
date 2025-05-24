<script setup>
import { ref, watch, nextTick, onMounted, inject } from 'vue'

const props = defineProps({
  modelValue: String,
  index: Number, // Index within the word (optional now)
  flatIndex: Number, // ✅ Global flat index (required)
  disabled: Boolean,
  registerInput: Function, // ✅ Must be passed from parent
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
      const nextInput = inputRefs.value[props.flatIndex + 1]
      if (nextInput && !nextInput.disabled) {
        nextInput.focus()
      }
    })
  }
}

function handleBackspace() {
  if (!localValue.value && props.flatIndex > 0) {
    nextTick(() => {
      const prevInput = inputRefs.value[props.flatIndex - 1]
      if (prevInput && !prevInput.disabled) {
        prevInput.focus()
      }
    })
  }
}

// Global list shared from parent component
const inputRefs = inject('inputRefs')

onMounted(() => {
  if (input.value && props.registerInput) {
    // Call registerInput with just the input element
    props.registerInput(input.value)
  }
})
</script>

<template>
  <input
    ref="input"
    :data-index="flatIndex"
    v-model="localValue"
    :maxlength="1"
    :disabled="disabled"
    class="guess-box"
    @input="handleInput"
    @keydown.backspace="handleBackspace"
  />
</template>

<style scoped></style>
