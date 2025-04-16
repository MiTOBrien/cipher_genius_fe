<script setup>
import { RouterView } from 'vue-router'
import HeaderPage from './views/HeaderView.vue'
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
