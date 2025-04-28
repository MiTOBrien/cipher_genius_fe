<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const email = ref('')
const username = ref('')
const firstname = ref('')
const lastname = ref('')
const password = ref('')
const confirmpassword = ref('')
const router = useRouter()

const register = async () => {
  if (password.value !== confirmpassword.value) {
    alert('Passwords do not match')
    return
  }

  try {
    const response = await fetch('http://localhost:3000/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        username: username.value,
        password: password.value,
        confirmpassword: confirmpassword.value,
        firstname: firstname.value,
        lastname: lastname.value,
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
    <input v-model="username" type="text" id="username" name="username" placeholder="username" />
    <br />
    <label for="username">Username</label>
    <br />
    <input
      v-model="firstname"
      type="text"
      id="firstname"
      name="firstname"
      placeholder="first name - optional"
    />
    <br />
    <label for="firstname">First Name</label>
    <br />
    <input
      v-model="lastname"
      type="text"
      id="lastname"
      name="lastname"
      placeholder="last name - optional"
    />
    <br />
    <label for="lastname">Last Name</label>
    <br />
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
    <input
      v-model="confirmpassword"
      type="password"
      id="confirmpassword"
      name="confirmpassword"
      placeholder="confirm password"
    />
    <br />
    <label for="confirmpassword">Confirm Password</label>
    <br />
    <button @click="register">Register</button>
    <p>Go to <RouterLink to="/">login page</RouterLink></p>
    <p>or <RouterLink to="/home">continue as a guest</RouterLink>.</p>
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
