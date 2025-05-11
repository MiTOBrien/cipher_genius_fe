<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const token = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const error = ref('')
const success = ref('')

onMounted(() => {
  token.value = route.query.token || ''
})

const resetPassword = async () => {
  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match'
    return
  }

  try {
    const response = await fetch('http://localhost:3001/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          reset_password_token: token.value,
          password: password.value,
          password_confirmation: passwordConfirmation.value,
        }
      }),
    })

    const data = await response.json()

    if (response.ok) {
      success.value = 'Password reset successful! Redirecting to login...'
      setTimeout(() => router.push('/'), 2000)
    } else {
      error.value = data.error || 'Reset failed'
    }
  } catch (err) {
    console.error(err)
    error.value = 'Something went wrong'
  }
}
</script>

<template>
  <div class="reset-form">
    <h2>Reset Password</h2>

    <input v-model="password" type="password" placeholder="New Password" />
    <input v-model="passwordConfirmation" type="password" placeholder="Confirm New Password" />

    <button @click="resetPassword">Reset Password</button>

    <p v-if="error" style="color: red">{{ error }}</p>
    <p v-if="success" style="color: green">{{ success }}</p>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  color: #84ce00;
  font-size: 2.5rem;
}

.reset-form {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}
input {
  display: block;
  margin: 10px auto;
}
button {
  margin: 10px;
  height: 50px;
  width: 100px;
  font-size: 1rem;
  color: #01bfff;
  background-color: #241822;
}
</style>