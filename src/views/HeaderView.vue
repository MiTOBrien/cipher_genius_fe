<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'

const headerText = ref(null)
const router = useRouter()
const userStore = useUserStore()

const username = computed(() => userStore.username || userStore.name || userStore.email)
const isLoggedIn = computed(() => userStore.isLoggedIn)

const changeHeader = () => {
  if (headerText.value) {
    headerText.value.textContent = 'Cipher Genius'
  }
}

const logout = () => {
  userStore.logout()
  router.push('/home')
}

onMounted(() => {
  setTimeout(changeHeader, 1500)
  userStore.restoreFromLocalStorage()
})
</script>

<template>
  <nav>
    <div class="left-nav">
      <RouterLink class="nav-link" to="/home">Home</RouterLink>
      <RouterLink class="nav-link" to="/about">About Ciphers</RouterLink>
      <RouterLink class="nav-link" to="/caesar">Caesar Cipher</RouterLink>
      <template v-if="isLoggedIn">
        <RouterLink class="nav-link" to="/profile">{{ username }}</RouterLink>
      </template>
    </div>

    <div class="right-nav">
      <template v-if="isLoggedIn">
        <button class="nav-button" @click="logout">Logout</button>
      </template>
      <template v-else>
        <RouterLink class="nav-link" to="/">Login</RouterLink>
      </template>
    </div>
  </nav>
  <h1 ref="headerText">Djqifs Hfojvt</h1>
</template>

<style scoped>
body {
  margin: 0;
  padding: 0;
}
h1 {
  font-size: 4rem;
  text-align: center;
  color: #01bfff;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: #241822;
}

.nav-link {
  margin: 0 10px;
  padding: 5px;
  color: #01bfff;
  text-decoration: none;
}

.left-nav {
  display: flex;
  align-items: center;
}

.right-nav {
  display: flex;
  align-items: center;
}

.nav-button {
  background: none;
  border: none;
  color: #01bfff;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 10px;
}
</style>
