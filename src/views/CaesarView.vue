<script setup>
import { ref, watch, computed } from 'vue'
import GameNavigation from '@/components/GameNavigation.vue'
import { getQuote } from '@/components/FetchQuote'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '@/settings'

const encryptedText = ref([])
const userGuesses = ref([])
const inputRefs = ref([])
const result = ref(null)
const quoteText = computed(() => quoteToEncrypt.value.quote || '')

const quoteToEncrypt = ref({
  quote: '',
  // author: '',
})

const fetchQuote = async () => {
  const result = await getQuote()
  quoteToEncrypt.value = result
}

const startGame = async () => {
  await fetchQuote()
  encryptText()
}

function encryptText() {
  let encrypted = ''
  let shift = getRandomShift()

  const original = quoteToEncrypt.value.quote
  const guesses = []

  for (let i = 0; i < original.length; i++) {
    let char = original[i]
    let code = char.charCodeAt(0)

    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      // it's a letter
      let base = code >= 97 ? 97 : 65
      code = ((((code - base + shift) % 26) + 26) % 26) + base
      encrypted += String.fromCharCode(code)
      guesses.push('') // let user guess this letter
    } else {
      // punctuation or space — leave as is and auto-fill
      encrypted += char
      guesses.push(char)
    }
  }

  encryptedText.value = encrypted.split('')
  userGuesses.value = guesses
  result.value = null
}

function getRandomShift() {
  let min = 1
  let max = 25
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

function isLetter(char) {
  return /^[a-zA-Z]$/.test(char)
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
      const cleanedQuote = quoteToEncrypt.value.quote.replace(/\s/g, '')
      result.value =
        cleanedGuess.toLowerCase() === cleanedQuote.toLowerCase() ? 'correct' : 'incorrect'
    } else {
      result.value = null
    }
  },
  { deep: true },
)
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
      <GameNavigation
        v-for="(guess, index) in userGuesses"
        :key="'guess' + index"
        v-model="userGuesses[index]"
        :index="index"
        :registerInput="(el, index) => (inputRefs.value[index] = el)"
        :disabled="!isLetter(quoteText[index]) || result !== null"
      />
    </div>
  </section>
  <section class="wrapper">
    <div v-if="result === 'correct'" class="result correct">{{ VICTORY_MESSAGE }}</div>
    <div v-else-if="result === 'incorrect'" class="result incorrect">
      {{ DEFEAT_MESSAGE }}
    </div>
  </section>
  <section class="wrapper">
    <button @click="startGame">Start</button>
  </section>
</template>

<style scoped>
h2 {
  text-align: center;
  color: #84ce00;
  font-size: 2.5rem;
}

button {
  margin: 10px;
  height: 50px;
  width: 100px;
  font-size: 1.25rem;
  color: #01bfff;
  background-color: #241822;
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
