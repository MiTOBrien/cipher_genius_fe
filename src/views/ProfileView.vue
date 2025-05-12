<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()
const cipherStats = ref([])

onMounted(() => {
  userStore.restoreFromLocalStorage()
  fetchCipherStats()
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

const fetchCipherStats = async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const response = await fetch('http://localhost:3001/api/v1/user_ciphers', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    const data = await response.json()
    cipherStats.value = data
  } catch (error) {
    console.error('Failed to fetch cipher stats:', error)
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}
</script>

<template>
  <h2>User Profile</h2>

  <div class="profile-field">
    <label for="username">Username:</label>
    <input type="text" v-model="userStore.username" id="username" name="username" size="25" />
  </div>

  <div class="profile-field">
    <label for="name">Name:</label>
    <input type="text" v-model="userStore.name" id="name" name="name" size="25" />
  </div>

  <div class="profile-field">
    <label>Email Address:</label>
    <input type="email" v-model="userStore.email" size="25" disabled />
  </div>

  <button @click="updateProfile">Update Profile</button>

  <RouterLink to="/cnange-password">Change Password</RouterLink>
  <h3>Your Cipher Stats</h3>
  <table>
    <thead>
      <tr>
        <th>Cipher</th>
        <th>Time</th>
        <th>Won</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(stat, index) in cipherStats" :key="index">
        <td>{{ stat.cipher.cipher }}</td>
        <td>{{ formatTime(stat.time) }}</td>
        <td>{{ stat.won ? 'Yes' : 'No' }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
h2 {
  text-align: center;
  color: #84ce00;
  font-size: 2.5rem;
}

h3 {
  text-align: center;
  color: #84ce00;
  font-size: 2rem;
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

table, th, td {
  border: 1px solid black;
}

table {
  margin: auto;
  width: 25%;
}

th {
  color: #84ce00;
}
td {
  color: #01bfff;
}
</style>
