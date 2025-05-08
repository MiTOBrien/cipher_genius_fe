<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import view_password_icon from '@/components/show-password-icon.png'

const email = ref('')
const username = ref('')
const name = ref('')
const password = ref('')
const confirmpassword = ref('')
const router = useRouter()
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const register = async () => {
  if (password.value !== confirmpassword.value) {
    alert('Passwords do not match')
    return
  }

  try {
    const response = await fetch('http://localhost:3001/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          email: email.value,
          username: username.value,
          password: password.value,
          confirmpassword: confirmpassword.value,
          name: name.value,
        },
      }),
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('token', data.token)
      router.push('/home')
    } else {
      alert(data.error || 'Registration failed')
    }
  } catch (error) {
    console.error(error)
    alert('An error occurred during registration')
  }
}
</script>

<template>
  <div class="login-form">
    <form @submit.prevent="register">
      <input
        v-model="username"
        type="text"
        id="username"
        name="username"
        placeholder="Username - optional"
      />
      <br />
      <label for="username">Username</label>
      <br />
      <input v-model="name" type="text" id="name" name="name" placeholder="Name - optional" />
      <br />
      <label for="name">Name</label>
      <br />
      <input v-model="email" type="email" id="email" name="email" placeholder="email address" />
      <br />
      <label for="email">Email Address</label>
      <br />
      <input
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        id="password"
        name="password"
        placeholder="password"
      />
      <br />
      <label for="password">Password</label>
      <img :src="view_password_icon" alt="Show password" @click="togglePassword" />
      <br />
      <input
        v-model="confirmpassword"
        :type="showConfirmPassword ? 'text' : 'password'"
        id="confirmpassword"
        name="confirmpassword"
        placeholder="confirm password"
      />
      <br />
      <label for="confirmpassword">Confirm Password</label>
      <img :src="view_password_icon" alt="Show confirm password" @click="toggleConfirmPassword" />
      <br />
      <button type="submit">Register</button>
    </form>
    <p>Go to <RouterLink to="/">login page</RouterLink></p>
    <p>or <RouterLink to="/home">continue as a guest</RouterLink>.</p>
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
