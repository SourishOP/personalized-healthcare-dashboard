<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <nav class="navbar">
      <div class="container nav-content">
        <h1 class="logo">HealthDash</h1>
        <div class="nav-links">
           <!-- Navigation items could go here -->
        </div>
      </div>
    </nav>
    
    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.navbar {
    background: white;
    border-bottom: 1px solid #eee;
    padding: 15px 0;
    margin-bottom: 30px;
}
.nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.logo {
    margin: 0;
    color: var(--primary-color);
}
</style>
