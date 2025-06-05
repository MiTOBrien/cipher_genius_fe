<script setup>
import { ref, watch, computed, provide } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import GameNavigation from '@/components/GameNavigation.vue'
import { getQuote } from '@/components/FetchQuote'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '@/settings'
import GameTimer from '@/components/GameTimer.vue'

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL
const userStore = useUserStore()
const encryptedText = ref([])
const userGuesses = ref([])
const result = ref(null)
const quoteText = computed(() => quoteToEncrypt.value.quote || '')
const isTimerRunning = ref(false)
const resetKey = ref(0)
const elapsedSeconds = ref(0)
const inputRefs = ref([])
provide('inputRefs', inputRefs)

const quoteToEncrypt = ref({
  quote: '',
  // author: '', May add later.
})

const fetchQuote = async () => {
  const result = await getQuote()
  quoteToEncrypt.value = result
}

const startGame = async () => {
  // Reset timer first (before new game starts)
  isTimerRunning.value = false
  resetKey.value = Date.now()

  await fetchQuote()
  encryptText()

  // Initialize inputRefs array immediately after encryption
  const totalChars = encryptedText.value.flat().length
  inputRefs.value = new Array(totalChars).fill(null)

  // Start timer after everything is set up
  isTimerRunning.value = true
  console.log('Set isTimerRunning to:', isTimerRunning.value)
}

const giveUp = () => {
  result.value = 'gave-up'
  isTimerRunning.value = false
  // submitGameResult will be called by the watcher
}

function encryptText() {
  const original = quoteToEncrypt.value.quote
  const splitWordsAndSpaces = original.split(/(\s+)/) // keeps spaces

  const encrypted = []
  const guesses = []

  for (const segment of splitWordsAndSpaces) {
    const encryptedWord = []
    const guessWord = []

    for (const char of segment) {
      const code = char.charCodeAt(0)

      if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
        // Atbash cipher: A->Z, B->Y, C->X, etc.
        const isUpperCase = code >= 65 && code <= 90
        const base = isUpperCase ? 65 : 97
        // Correct Atbash transformation: mirror position in alphabet
        const encryptedChar = String.fromCharCode(base + (25 - (code - base)))
        encryptedWord.push(encryptedChar)
        guessWord.push('')
      } else {
        encryptedWord.push(char)
        guessWord.push(char)
      }
    }

    encrypted.push(encryptedWord)
    guesses.push(guessWord)
  }

  encryptedText.value = encrypted
  userGuesses.value = guesses
  result.value = null
}

function isLetter(char) {
  return /^[a-zA-Z]$/.test(char)
}

function getFlatIndex(wordIndex, charIndex) {
  let index = 0
  for (let i = 0; i < wordIndex; i++) {
    index += userGuesses.value[i].length
  }
  index += charIndex
  return index
}

// Safe registerInput function with error checking
function registerInput(el, wordIndex, charIndex) {
  const flatIndex = getFlatIndex(wordIndex, charIndex)

  // Ensure the array exists and has the right size
  if (!inputRefs.value || inputRefs.value.length <= flatIndex) {
    console.warn('InputRefs array not properly initialized for index:', flatIndex)
    return
  }

  if (el) {
    inputRefs.value[flatIndex] = el
  }
}

function handleSecondsUpdate(val) {
  elapsedSeconds.value = val
}

async function submitGameResult() {
  const gameResult = {
    user_cipher: {
      user_id: userStore.id,
      cipher_id: 1,
      time: elapsedSeconds.value,
      won: result.value === 'correct',
    },
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user_ciphers/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.token}`,
      },
      body: JSON.stringify(gameResult),
    })

    if (!response.ok) {
      console.error('Failed to save game result')
    }
  } catch (error) {
    console.error('Error sending game result:', error)
  }
}

watch(
  userGuesses,
  (guesses) => {
    const flatGuesses = guesses.flat()
    const flatEncrypted = encryptedText.value.flat()

    const isComplete = flatGuesses.every((char, i) => {
      return char !== '' || flatEncrypted[i] === ' '
    })

    if (isComplete) {
      const cleanedGuess = flatGuesses.join('').replace(/\s/g, '')
      const cleanedQuote = quoteToEncrypt.value.quote.replace(/\s/g, '')
      result.value =
        cleanedGuess.toLowerCase() === cleanedQuote.toLowerCase() ? 'correct' : 'incorrect'
    } else {
      result.value = null
    }
  },
  { deep: true },
)

watch(result, (newVal) => {
  if (newVal === 'correct' || newVal === 'incorrect' || newVal === 'gave-up') {
    isTimerRunning.value = false
    submitGameResult()
  }
})
</script>

<template>
  <h2 ref="headerText">Atbash Cipher</h2>

  <section class="wrapper">
    <!-- Encrypted Text Display -->
    <div class="atbash-container">
      <span v-for="(word, wordIndex) in encryptedText" :key="'word' + wordIndex" class="word-box">
        <span
          v-for="(char, charIndex) in word"
          :key="`char-${wordIndex}-${charIndex}`"
          class="char-box"
        >
          {{ char }}
        </span>
      </span>
    </div>
  </section>

  <section class="wrapper">
    <!-- Guess Input Boxes -->
    <div class="guess-container">
      <span
        v-for="(word, wordIndex) in userGuesses"
        :key="'guess-word' + wordIndex"
        class="word-box"
      >
        <GameNavigation
          v-for="(guess, charIndex) in word"
          :key="`guess-${wordIndex}-${charIndex}`"
          v-model="userGuesses[wordIndex][charIndex]"
          :index="charIndex"
          :flatIndex="getFlatIndex(wordIndex, charIndex)"
          :registerInput="(el) => registerInput(el, wordIndex, charIndex)"
          :disabled="!isLetter(quoteText[getFlatIndex(wordIndex, charIndex)]) || result !== null"
        />
      </span>
    </div>
  </section>

  <section class="wrapper">
    <section class="timer-wrapper">
      <GameTimer
        :isRunning="isTimerRunning"
        :resetTrigger="resetKey"
        @update:seconds="handleSecondsUpdate"
      />
    </section>
    <div v-if="result === 'correct'" class="result correct">{{ VICTORY_MESSAGE }}</div>
    <div v-else-if="result === 'incorrect'" class="result incorrect">
      {{ DEFEAT_MESSAGE }}
      <p>The quote was: {{ quoteText }}</p>
    </div>
    <div v-else-if="result === 'gave-up'" class="result gave-up">
      You gave up! The quote was: {{ quoteText }}
    </div>
  </section>

  <section class="wrapper">
    <!-- Dynamic Start/Give Up Button -->
    <button v-if="encryptedText.length === 0 || result !== null" @click="startGame">
      Start
    </button>
    <button v-else @click="giveUp" class="give-up-btn">
      Give Up
    </button>
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

.give-up-btn {
  color: #ff9800;
  border: 2px solid #ff9800;
}

.wrapper {
  display: flex;
  justify-content: center;
}

.atbash-container,
.guess-container {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  justify-content: center;
}

.word-box {
  display: inline-flex;
  flex-wrap: nowrap;
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
.gave-up {
  color: #ff9800;
}
</style>