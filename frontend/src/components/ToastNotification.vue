<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  show: Boolean,
  message: String,
  type: {
      type: String,
      default: 'success' // success or error
  }
})
</script>

<template>
  <transition name="slide-up">
    <div v-if="show" class="toast" :class="type">
      <span class="icon">{{ type === 'success' ? '✅' : '❌' }}</span>
      <span class="message">{{ message }}</span>
    </div>
  </transition>
</template>

<style scoped>
.toast {
    position: fixed;
    bottom: 90px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    padding: 12px 24px;
    border-radius: 30px;
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 2000;
    width: max-content;
    max-width: 90%;
}

.success {
    background-color: var(--success-color);
}

.error {
    background-color: var(--warning-color);
}

.icon {
    margin-right: 8px;
    font-size: 18px;
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
