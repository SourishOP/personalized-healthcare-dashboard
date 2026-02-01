<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const email = ref('')
const password = ref('')
const role = ref('patient')
const error = ref('')

const handleRegister = async () => {
  error.value = ''
  try {
    const res = await axios.post('/api/auth/register', {
        email: email.value,
        password: password.value,
        role: role.value
    });
    // On success, redirect to login
    alert('Registration successful! Please login.');
    router.push('/login');
  } catch (e) {
    error.value = e.response?.data?.message || 'Registration failed'
  }
}
</script>

<template>
  <div class="register-container">
    <div class="card register-card">
      <h2>Create Account</h2>
      
      <div v-if="error" class="alert error">{{ error }}</div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" required minlength="8" />
        </div>
        <div class="form-group">
          <label>Role</label>
          <select v-model="role">
             <option value="patient">Patient</option>
             <option value="caregiver">Caregiver</option>
          </select>
        </div>
        <button type="submit" class="btn-primary">Register</button>
      </form>

      <p class="login-link">
        Already have an account? <router-link to="/login">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
    display: flex;
    justify-content: center;
    padding-top: 50px;
}
.register-card {
    width: 100%;
    max-width: 400px;
}
.error {
    color: red;
    margin-bottom: 15px;
}
select {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
.login-link {
    margin-top: 15px;
    text-align: center;
    font-size: 0.9em;
}
</style>
