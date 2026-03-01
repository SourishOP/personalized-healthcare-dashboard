<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const mfaCode = ref('')
const errors = ref({})
const isLoading = ref(false)

const login = async () => {
    errors.value = {}
    if (!email.value) errors.value.email = 'Email is required'
    if (!password.value) errors.value.password = 'Password is required'
    if (!mfaCode.value || mfaCode.value.length !== 6) errors.value.mfaCode = 'Invalid 6-digit MFA code'

    if (Object.keys(errors.value).length > 0) return

    isLoading.value = true
    
    // Simulate API call
    setTimeout(() => {
        isLoading.value = false
        // For assignment, just push to dashboard
        router.push('/')
    }, 1000)
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-header">
      <h2>Welcome Back</h2>
      <p>Securely access your health dashboard</p>
    </div>

    <div class="card">
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            type="email" 
            v-model="email" 
            placeholder="name@example.com"
            :class="{ 'border-error': errors.email }"
          >
          <span v-if="errors.email" class="error-text">⚠️ {{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password" 
            type="password" 
            v-model="password" 
            placeholder="••••••••"
            :class="{ 'border-error': errors.password }"
          >
          <span v-if="errors.password" class="error-text">⚠️ {{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="mfa">6-Digit MFA Code</label>
          <input 
            id="mfa" 
            type="text" 
            v-model="mfaCode" 
            placeholder="123456"
            maxlength="6"
            inputmode="numeric"
            :class="{ 'border-error': errors.mfaCode }"
          >
          <span v-if="errors.mfaCode" class="error-text">⚠️ {{ errors.mfaCode }}</span>
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc(100vh - 40px);
}
.auth-header {
    text-align: center;
    margin-bottom: var(--spacing-lg);
}
.auth-header h2 {
    margin: 0 0 var(--spacing-sm);
    color: var(--primary-color);
}
.auth-header p {
    margin: 0;
    color: var(--text-light);
}
.border-error {
    border-color: var(--warning-color);
}
</style>
