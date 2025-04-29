<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/users/sign_in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.user.username)
      localStorage.setItem('firstname', data.user.first_name)
      localStorage.setItem('lastname', data.user.last_name)
      window.dispatchEvent(new Event('login-success'))
      setTimeout(() => {
        router.push('/home')
      }, 50)
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
    <input v-model="email" type="email" id="email" name="email" placeholder="email address" />
    <br />
    <label for="email">Email Address</label>
    <br />
    <input
      v-model="password"
      type="password"
      id="password"
      name="password"
      placeholder="password"
    />
    <br />
    <label for="password">Password</label>
    <br />
    <button @click="login">Login</button>
    <p>Login or <RouterLink to="/register">create an account</RouterLink> to track your progress</p>
    <p>or <RouterLink to="/home">continue as guest</RouterLink>.</p>
  </div>
</template>

<style scoped>
input {
  margin: 15px 10px 5px 10px;
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
