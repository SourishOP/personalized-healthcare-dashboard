<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import axios from 'axios'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const mfaCode = ref('')
const error = ref('')

// MFA Setup State
const isSetupMode = ref(false)
const qrCodeUrl = ref('')
const secret = ref('')

const handleLogin = async () => {
  error.value = ''
  try {
    const res = await auth.login(email.value, password.value)
    
    if (res.requireMfaSetup) {
       isSetupMode.value = true;
       // Fetch Setup Data
       const setupRes = await axios.get('/api/auth/mfa/setup', {
           headers: { Authorization: `Bearer ${res.token}` }
       });
       qrCodeUrl.value = setupRes.data.qr_code;
       secret.value = setupRes.data.secret;
    }
  } catch (e) {
    error.value = e
  }
}

const handleVerify = async () => {
    error.value = ''
    try {
        await auth.verifyMfa(mfaCode.value)
    } catch (e) {
        error.value = e
    }
}
</script>

<template>
  <div class="login-container">
    <div class="card login-card">
      <h2>{{ isSetupMode ? 'Setup MFA' : (auth.mfaRequired ? 'Enter Code' : 'Login') }}</h2>
      
      <!-- ERROR ALERT -->
      <div v-if="error" class="alert error">{{ error }}</div>

      <!-- STEP 1: EMAIL/PASSWORD -->
      <form v-if="!auth.mfaRequired && !isSetupMode" @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit" class="btn-primary">Login</button>
      </form>

      <!-- STEP 2: MFA VERIFY -->
      <form v-if="auth.mfaRequired" @submit.prevent="handleVerify">
        <p>Please enter the code from your authenticator app.</p>
        <div class="form-group">
          <label>MFA Code</label>
          <input type="text" v-model="mfaCode" placeholder="000000" maxlength="6" required />
        </div>
        <button type="submit" class="btn-primary">Verify</button>
      </form>

      <!-- STEP 2B: MFA SETUP -->
      <div v-if="isSetupMode">
         <p>Scan this QR code with Google Authenticator.</p>
         <img :src="qrCodeUrl" alt="MFA QR Code" class="qr-code" />
         <p><small>Secret: {{ secret }}</small></p>
         
         <form @submit.prevent="handleVerify">
            <div class="form-group">
                <label>Enter Code to Confirm</label>
                <input type="text" v-model="mfaCode" required />
            </div>
            <button type="submit" class="btn-primary">Activate MFA</button>
         </form>
      </div>

      <p class="register-link" v-if="!isSetupMode && !auth.mfaRequired">
        Don't have an account? <router-link to="/register">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-link {
    margin-top: 15px;
    text-align: center;
    font-size: 0.9em;
}
.login-container {
    display: flex;
    justify-content: center;
    padding-top: 50px;
}
.login-card {
    width: 100%;
    max-width: 400px;
}
.error {
    color: red;
    margin-bottom: 15px;
}
.qr-code {
    display: block;
    margin: 10px auto;
    border: 1px solid #eee;
}
</style>
