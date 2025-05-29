<script setup>
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL
const userStore = useUserStore()
const cipherStats = ref([])

// Password change state
const showPasswordSection = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordErrors = ref([])

onMounted(() => {
  userStore.restoreFromLocalStorage()
  fetchCipherStats()
})

const totalAttempted = computed(() => {
  return cipherStats.value.length
})

const totalSolved = computed(() => {
  return cipherStats.value.filter((stat) => stat.won).length
})

const successPercentage = computed(() => {
  if (totalAttempted.value === 0) return 0
  return Math.round((totalSolved.value / totalAttempted.value) * 100)
})

const updateProfile = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Not logged in')
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/update`, {
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

const validatePassword = () => {
  passwordErrors.value = []

  if (!currentPassword.value) {
    passwordErrors.value.push('Current password is required')
  }

  if (!newPassword.value) {
    passwordErrors.value.push('New password is required')
  } else if (newPassword.value.length < 8) {
    passwordErrors.value.push('New password must be at least 6 characters')
  }

  if (newPassword.value !== confirmPassword.value) {
    passwordErrors.value.push('Password confirmation does not match')
  }

  return passwordErrors.value.length === 0
}

const changePassword = async () => {
  if (!validatePassword()) {
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    alert('Not logged in')
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: currentPassword.value,
        new_password: newPassword.value,
        new_password_confirmation: confirmPassword.value,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      alert('Password changed successfully!')
      // Clear the form
      currentPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
      showPasswordSection.value = false
      passwordErrors.value = []
    } else {
      passwordErrors.value = [data.error || 'Password change failed']
    }
  } catch (err) {
    console.error(err)
    passwordErrors.value = ['An error occurred while changing password']
  }
}

const togglePasswordSection = () => {
  showPasswordSection.value = !showPasswordSection.value
  if (!showPasswordSection.value) {
    // Clear form when hiding
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    passwordErrors.value = []
  }
}

const fetchCipherStats = async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user_ciphers`, {
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

  <!-- Profile Update Form -->
  <form @submit.prevent="updateProfile">
    <div class="profile-field">
      <label for="username">Username:</label>
      <input type="text" v-model="userStore.username" id="username" name="username" size="25" />
    </div>

    <div class="profile-field">
      <label for="name">Name:</label>
      <input type="text" v-model="userStore.name" id="name" name="name" size="25" />
    </div>

    <div class="profile-field">
      <label>Email:</label>
      <input type="email" v-model="userStore.email" size="25" disabled />
    </div>
    <div class="button-wrapper">
      <button type="submit">Update Profile</button>
    </div>
  </form>

  <!-- Password Change Section -->
  <div class="password-section">
    <div class="button-wrapper">
      <button type="button" @click="togglePasswordSection" class="toggle-password-btn">
        {{ showPasswordSection ? 'Cancel Password Change' : 'Change Password' }}
      </button>
    </div>

    <div v-if="showPasswordSection" class="password-form">
      <h3>Change Password</h3>

      <!-- Error Messages -->
      <div v-if="passwordErrors.length > 0" class="error-messages">
        <ul>
          <li v-for="error in passwordErrors" :key="error" class="error">{{ error }}</li>
        </ul>
      </div>

      <form @submit.prevent="changePassword">
        <div class="profile-field">
          <label for="current-password">Current Password:</label>
          <input
            type="password"
            v-model="currentPassword"
            id="current-password"
            size="25"
            autocomplete="current-password"
          />
        </div>

        <div class="profile-field">
          <label for="new-password">New Password:</label>
          <input
            type="password"
            v-model="newPassword"
            id="new-password"
            size="25"
            autocomplete="new-password"
          />
        </div>

        <div class="profile-field">
          <label for="confirm-password">Confirm Password:</label>
          <input
            type="password"
            v-model="confirmPassword"
            id="confirm-password"
            size="25"
            autocomplete="new-password"
          />
        </div>

        <div class="button-wrapper">
          <button type="submit">Update Password</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Cipher Stats -->
  <h3>Your Cipher Stats</h3>
  <p>
    You have attempted {{ totalAttempted }} cipher{{ totalAttempted !== 1 ? 's' : '' }} and solved
    {{ totalSolved }} cipher{{ totalSolved !== 1 ? 's' : '' }}.

    <br />You have solved {{ successPercentage }}% of the ciphers you attempted.
  </p>
  <table v-if="cipherStats.length > 0">
    <thead>
      <tr>
        <th>Cipher</th>
        <th>Time</th>
        <th>Solved</th>
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
  <div v-else class="no-stats">
    <p>No cipher attempts yet. Start solving some ciphers to see your stats!</p>
  </div>
</template>

<style scoped>
p {
  text-align: center;
  color: #84ce00;
}

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
  display: flex;
  align-items: center;
  margin: 10px auto;
  color: #84ce00;
  width: 300px;
}

.profile-field label {
  width: 120px;
  text-align: right;
  margin-right: 10px;
}

.profile-field input {
  flex: 1;
  padding: 4px;
}

.button-wrapper {
  display: flex;
  justify-content: center;
}

.password-section {
  margin: 30px 0;
  padding: 20px;
  border-top: 1px solid #ccc;
}

.password-form {
  margin-top: 20px;
}

.toggle-password-btn {
  background-color: #84ce00;
  color: #241822;
}

.toggle-password-btn:hover {
  background-color: #6ba800;
}

.error-messages {
  margin: 10px auto;
  width: 300px;
}

.error-messages ul {
  list-style: none;
  padding: 0;
}

.error {
  color: #ff4444;
  font-size: 0.9rem;
  margin: 5px 0;
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

button:hover {
  background-color: #3a2832;
}

table,
th,
td {
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
