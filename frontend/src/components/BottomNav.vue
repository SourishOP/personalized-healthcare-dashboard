<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// Verify if bottom nav should be shown (hide on auth screens)
const showNav = computed(() => {
    return route.name !== 'login' && route.name !== 'register' && route.name !== 'auth'
})
</script>

<template>
  <nav v-if="showNav" class="bottom-nav">
    <router-link to="/" class="nav-item" active-class="active">
        <span class="icon">🏠</span>
        <span class="label">Home</span>
    </router-link>
    <router-link to="/log" class="nav-item" active-class="active">
        <span class="icon">+</span>
        <span class="label">Log</span>
    </router-link>
    <router-link to="/trends" class="nav-item" active-class="active">
        <span class="icon">📈</span>
        <span class="label">Trends</span>
    </router-link>
    <router-link to="/settings" class="nav-item" active-class="active">
        <span class="icon">⚙️</span>
        <span class="label">Settings</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--card-bg);
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 70px;
    z-index: 1000;
    max-width: 600px;
    margin: 0 auto;
    padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: var(--text-light);
    height: 100%;
    flex: 1;
    /* Touch Target ensures taps are registered easily */
    min-width: 64px;
}

.icon {
    font-size: 24px;
    margin-bottom: 4px;
}

.label {
    font-size: 12px;
    font-weight: 500;
}

.active {
    color: var(--primary-color);
}
</style>
