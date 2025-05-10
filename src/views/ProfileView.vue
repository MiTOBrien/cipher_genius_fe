<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()

onMounted(() => {
  userStore.restoreFromLocalStorage()
})

const updateProfile = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Not logged in')
    return
  }

  try {
    const response = await fetch('http://localhost:3001/api/v1/users/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: {
          name: userStore.name,
          username: userStore.username,
        },
      }),
    })

    const data = await response.json()

    if (response.ok) {
      userStore.username = data.user.username
      userStore.name = data.user.name

      alert('Profile updated successfully!')
    } else {
      alert(data.error || 'Update failed')
    }
  } catch (err) {
    console.error(err)
    alert('An error occurred while updating the profile')
  }
}
</script>

<template>
  <h2>User Profile</h2>

  <div class="profile-field">
    <label for="username">Username:</label>
    <input type="text" v-model="userStore.username" id="username" name="username" />
  </div>

  <div class="profile-field">
    <label for="name">Name:</label>
    <input type="text" v-model="userStore.name" id="name" name="name" />
  </div>

  <div class="profile-field">
    <label>Email Address:</label>
    <input type="email" v-model="userStore.email" disabled />
  </div>

  <button @click="updateProfile">Update Profile</button>
</template>

<style scoped>
h2 {
  text-align: center;
  color: #84ce00;
  font-size: 2.5rem;
}

.profile-field {
  margin: 10px;
  color: #84ce00;
}

input {
  margin-left: 10px;
  padding: 4px;
}

button {
  margin: 20px 10px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #241822;
  color: #01bfff;
  border: none;
  cursor: pointer;
}
</style>
