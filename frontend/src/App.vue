<script setup>
import { RouterView, useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
import { computed } from 'vue'

const route = useRoute()
const showNav = computed(() => !['/login', '/register'].includes(route.path))
</script>

<template>
  <div class="app-container">
    <main class="screen-container">
      <RouterView />
    </main>
    <BottomNav v-if="showNav" />
  </div>
</template>

<style scoped>
/* App specific styles handled in style.css for global containment */
</style>
