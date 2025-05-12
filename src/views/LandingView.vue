<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import view_password_icon from '@/components/show-password-icon.png'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()
const userStore = useUserStore()

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const login = async () => {
  try {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          email: email.value,
          password: password.value,
        },
      }),
    })

    const data = await response.json()

    const token = data.status.token

    if (response.ok && token) {
      userStore.setUser({
        token: token,
        id: data.status.data.user.id,
        username: data.status.data.user.username,
        name: data.status.data.user.name,
        email: data.status.data.user.email,
      })

      localStorage.setItem('token', token)

      router.push('/home')
    } else {
      alert(data.error || 'Login failed')
    }
  } catch (error) {
    console.error(error)
    alert('An error occurred during login')
  }
}
</script>

<template>
  <div class="login-form">
    <form @submit.prevent="login">
      <input
        v-model="email"
        type="email"
        id="email"
        name="email"
        placeholder="email address"
        size="25"
      />
      <br />
      <label for="email">Email Address</label>
      <br />
      <input
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        id="password"
        name="password"
        placeholder="password"
        size="25"
      />
      <br />
      <label for="password">Password</label>
      <img :src="view_password_icon" alt="Show password" @click="togglePassword" />
      <br />
      <button type="submit">Login</button>
    </form>

    <p>Login or <RouterLink to="/register">create an account</RouterLink> to track your progress</p>
    <p>or <RouterLink to="/home">continue as guest</RouterLink>.</p>
    <p><RouterLink to="/forgot-password">Forgot your password?</RouterLink></p>
  </div>
</template>

<style scoped>
input {
  margin: 15px 10px 5px 10px;
}

img {
  height: 25px;
  cursor: pointer;
  vertical-align: middle;
  padding-left: 5px;
}

button {
  margin: 10px;
  height: 50px;
  width: 100px;
  font-size: 1.25rem;
  color: #01bfff;
  background-color: #241822;
}

a {
  color: #01bfff;
}

label,
p {
  color: #84ce00;
}

.login-form {
  text-align: center;
}
</style>
