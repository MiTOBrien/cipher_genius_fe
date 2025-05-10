<script setup>
import { RouterView } from 'vue-router'
import HeaderPage from './views/HeaderView.vue'
import { useUserStore } from './stores/useUserStore'

const userStore = useUserStore()

userStore.restoreFromLocalStorage()
</script>

<template>
  <header>
    <div class="wrapper">
      <HeaderPage />
    </div>
  </header>

  <RouterView />
</template>

<style></style>
