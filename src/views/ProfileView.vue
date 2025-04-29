<script setup>
import { ref, onMounted } from 'vue';

const username = ref('')
const email = ref('')
const firstname = ref('')
const lastname = ref('')

onMounted(() => {
  username.value = localStorage.getItem('username') || ''
  email.value = localStorage.getItem('email') || ''
  firstname.value = localStorage.getItem('first_name') || ''
  lastname.value = localStorage.getItem('last_name') || ''
})
</script>

<template>
  <h2>User Profile</h2>
  <p>Username: {{ username }}</p>
  <p>First Name: {{ firstname }}</p>
  <p>Last Name : {{ lastname }}</p>
  <p>Email Address: {{ email }}</p>
</template>

<style scoped>
h2 {
  text-align: center;
  color: #84ce00;
  font-size: 2.5rem;
}

p {
  color: #84ce00;
  margin-left: 10px;
}
</style>
