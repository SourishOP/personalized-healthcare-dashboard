<script setup>
import { RouterView } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
</script>

<template>
  <div class="app-container">
    <main class="screen-container">
      <RouterView />
    </main>
    <BottomNav />
  </div>
</template>

<style scoped>
/* App specific styles handled in style.css for global containment */
</style>
