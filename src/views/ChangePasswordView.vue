<script setup>
import { ref } from 'vue'

const email = ref('')
const success = ref(null)
const error = ref(null)

const submit = async () => {
  success.value = null
  error.value = null

  try {
    const response = await fetch('http://localhost:3001/api/v1/password/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    })

    const data = await response.json()

    if (response.ok) {
      success.value = data.message
    } else {
      error.value = data.error
    }
  } catch (error) {
    error.value = 'An error occurred.'
  }
}
</script>

<template>
  <div class="forgot-password">
    <h2>Forgot Password</h2>
    <form @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="Enter your email" size="25"/>
      <button type="submit">Send Reset Instructions</button>
    </form>
    <p v-if="success" style="color: #84ce00">{{ success }}</p>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<style scoped>
h2 {
  color: #01bfff;
  margin-left: 10px;
}

input {
  margin-left: 10px;
}

p {
  margin-left: 10px;
}

button {
  margin: 10px;
  height: 25px;
  width: 200px;
  font-size: 1rem;
  color: #01bfff;
  background-color: #241822;
}
</style>