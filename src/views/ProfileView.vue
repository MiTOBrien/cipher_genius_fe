<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()

// Restore data from localStorage in case the page was reloaded
onMounted(() => {
  userStore.restoreFromLocalStorage()
})

const username = computed(() => userStore.username)
const email = computed(() => userStore.email)
const firstname = computed(() => userStore.firstname)
const lastname = computed(() => userStore.lastname)
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
