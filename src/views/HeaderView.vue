<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const headerText = ref(null)

function changeHeader() {
  if (headerText.value) {
    headerText.value.textContent = 'Cipher Genius'
  }
}
onMounted(() => {
  setTimeout(changeHeader, 1500)
})
</script>

<template>
  <nav>
    <RouterLink class="nav-link" to="/home">Home</RouterLink>
    <RouterLink class="nav-link" to="/about">About Ciphers</RouterLink>
    <RouterLink class="nav-link" to="/caesar">Caesar Cipher</RouterLink>
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
  align-items: center;
  height: 60px;
  background-color: #241822;
}

.nav-link {
  margin: 0 10px;
  padding: 5px;
  color: #01bfff;
  text-decoration: none;
}
</style>
