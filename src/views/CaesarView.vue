<script setup>
import { ref, nextTick, watch } from 'vue'

let quoteToEncrypt = 'Cipher Genius'
const encryptedText = ref([])
const userGuesses = ref([])
const inputRefs = ref([])
const result = ref(null)

function encryptText() {
  let encrypted = ''
  let shift = getRandomShift()

  for (let i = 0; i < quoteToEncrypt.length; i++) {
    let char = quoteToEncrypt[i]
    let code = char.charCodeAt(0)

    if (code >= 65 && code <= 90) {
      // uppercase A-Z
      code = ((((code - 65 + shift) % 26) + 26) % 26) + 65
      encrypted += String.fromCharCode(code)
    } else if (code >= 97 && code <= 122) {
      // lowercase a-z
      code = ((((code - 97 + shift) % 26) + 26) % 26) + 97
      encrypted += String.fromCharCode(code)
    } else {
      // non-letter (e.g., space or punctuation)
      encrypted += char
    }
  }

  encryptedText.value = encrypted.split('')
  userGuesses.value = encrypted.split('').map((char) => (char === ' ' ? '' : ''))
  result.value = null
}

function getRandomShift() {
  let min = 1
  let max = 25
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

function moveToNext(index, event) {
  const value = event.target.value

  if (value && index < userGuesses.value.length - 1) {
    nextTick(() => {
      const nextInput = inputRefs.value[index + 1]
      if (nextInput && !nextInput.disabled) {
        nextInput.focus()
      }
    })
  }
}

function moveToPrev(index) {
  if (!userGuesses.value[index] && index > 0) {
    nextTick(() => {
      const prevInput = inputRefs.value[index - 1]
      if (prevInput && !prevInput.disabled) {
        prevInput.focus()
      }
    })
  }
}

watch(
  userGuesses,
  (guesses) => {
    const isComplete = guesses.every((char, i) => {
      return char !== '' || encryptedText.value[i] === ' '
    })

    if (isComplete) {
      // Normalize for comparison: remove spaces from both sides
      const cleanedGuess = guesses.join('').replace(/\s/g, '')
      const cleanedQuote = quoteToEncrypt.replace(/\s/g, '')
      result.value =
        cleanedGuess.toLowerCase() === cleanedQuote.toLowerCase() ? 'correct' : 'incorrect'
    } else {
      result.value = null
    }
  },
  { deep: true },
)

encryptText()
</script>

<template>
  <h2 ref="headerText">Caesar Ciper</h2>
  <section class="wrapper">
    <div class="caesar-container">
      <span v-for="(char, index) in encryptedText" :key="index" class="char-box">
        {{ char }}
      </span>
    </div>
  </section>
  <section class="wrapper">
    <div class="guess-container">
      <input
        v-for="(guess, index) in userGuesses"
        :key="'guess' + index"
        v-model="userGuesses[index]"
        maxlength="1"
        class="guess-box"
        :disabled="quoteToEncrypt[index] === ' ' || result !== null"
        @input="moveToNext(index, $event)"
        @keydown.backspace="moveToPrev(index, $event)"
        ref="inputRefs"
      />
    </div>
  </section>
  <div v-if="result === 'correct'" class="result correct">✅ Correct!</div>
  <div v-else-if="result === 'incorrect'" class="result incorrect">❌ Try again!</div>
</template>

<style scoped>
h2 {
  text-align: center;
  color: #84ce00;
  font-size: 2.5rem;
}
.wrapper {
  display: flex;
  justify-content: center;
}

.caesar-container,
.guess-container {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  justify-content: center;
}

.char-box,
.guess-box {
  width: 2.25rem;
  height: 2.25rem;
  color: #84ce00;
  font-size: 1.75rem;
  text-align: center;
  border: 2px solid #01bfff;
  border-radius: 5px;
  line-height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.result {
  text-align: center;
  margin-top: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}
.correct {
  color: #00c853;
}
.incorrect {
  color: #d50000;
}
</style>
