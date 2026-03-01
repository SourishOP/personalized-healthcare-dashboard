<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const router = useRouter()
const auth = useAuthStore()

const isRegister = ref(false)
const email = ref('')
const password = ref('')
const mfaCode = ref('')
const errors = ref({})
const isLoading = ref(false)

// MFA Setup State
const isSetupMode = ref(false)
const qrCodeUrl = ref('')
const secret = ref('')
const tempToken = ref('') // Store token during registration

const handleAuth = async () => {
    errors.value = {}
    if (!email.value) errors.value.email = 'Email is required'
    if (!password.value) errors.value.password = 'Password is required'
    if (Object.keys(errors.value).length > 0) return

    isLoading.value = true
    
    try {
        if (isRegister.value) {
            // REGISTRATION FLOW
            const res = await axios.post('/api/auth/register', {
                email: email.value,
                password: password.value,
                role: 'patient'
            });
            
            // Auto-login to trigger MFA Setup
            const loginRes = await auth.login(email.value, password.value);
            if (loginRes.requireMfaSetup) {
                 isSetupMode.value = true;
                 const setupRes = await axios.get('/api/auth/mfa/setup', {
                     headers: { Authorization: `Bearer ${loginRes.token}` }
                 });
                 qrCodeUrl.value = setupRes.data.qr_code;
                 secret.value = setupRes.data.secret;
                 tempToken.value = loginRes.token;
                 auth.tempToken = loginRes.token; // Pass to store
            }
        } else {
            // LOGIN FLOW
            const res = await auth.login(email.value, password.value)
            if (res.requireMfaSetup) {
                 // User needs to set it up
                 isSetupMode.value = true;
                 const setupRes = await axios.get('/api/auth/mfa/setup', {
                     headers: { Authorization: `Bearer ${res.token}` }
                 });
                 qrCodeUrl.value = setupRes.data.qr_code;
                 secret.value = setupRes.data.secret;
            }
            // If mfaRequire is true, the template will swap
        }
    } catch (e) {
        errors.value.general = e.response?.data?.message || typeof e === 'string' ? e : 'Authentication failed. Is backend running?'
    } finally {
        isLoading.value = false
    }
}

const handleVerifyMfa = async () => {
    errors.value = {}
    const mfaString = mfaCode.value ? String(mfaCode.value) : ''
    
    if (mfaString.length !== 6) {
        errors.value.mfaCode = 'Invalid 6-digit MFA code'
        return;
    }

    isLoading.value = true;
    try {
        await auth.verifyMfa(mfaCode.value)
        // Store pushes to dashboard automatically on success
    } catch (e) {
        errors.value.mfaCode = e || 'Verification failed'
    } finally {
        isLoading.value = false;
    }
}

const toggleMode = () => {
    isRegister.value = !isRegister.value
    errors.value = {} 
    mfaCode.value = ''
}

const cancelMfa = () => {
    auth.logout();
    isSetupMode.value = false;
    auth.mfaRequired = false;
    email.value = '';
    password.value = '';
    mfaCode.value = '';
}
</script>

<template>
  <div class="auth-container">
    
    <div class="logo-mark">
      <span class="icon">✨</span>
      <h1>HealthDash</h1>
    </div>

    <!-- MFA VERIFICATION / SETUP FLOW -->
    <div v-if="auth.mfaRequired || isSetupMode" class="card auth-card shadow-lg">
      <div class="auth-header mb-6">
        <h2>{{ isSetupMode ? 'Secure Your Account' : 'Security Check' }}</h2>
        <p>{{ isSetupMode ? 'Set up Two-Factor Authentication' : 'Enter your 6-digit authenticator code' }}</p>
      </div>

      <div v-if="isSetupMode" class="text-center mb-6">
        <p class="text-sm text-gray-600 mb-2">Scan this QR code with Google Authenticator or Authy</p>
        <div class="qr-container">
            <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="MFA QR Code" class="qr-code" />
            <div v-else class="qr-placeholder spinner"></div>
        </div>
        <p class="mt-2 text-xs text-gray-500">Manual Key: <span class="font-mono text-primary">{{ secret }}</span></p>
      </div>

      <form @submit.prevent="handleVerifyMfa">
        <div class="form-group input-with-icon">
          <label for="mfaVerify">Security Code</label>
          <div class="input-wrapper">
              <span class="input-icon">🛡️</span>
              <input 
                id="mfaVerify" 
                type="text" 
                v-model="mfaCode" 
                placeholder="123456"
                maxlength="6"
                inputmode="numeric"
                :class="{ 'border-error': errors.mfaCode }"
                autocomplete="one-time-code"
              >
          </div>
          <span v-if="errors.mfaCode" class="error-text">⚠️ {{ errors.mfaCode }}</span>
        </div>

        <button type="submit" class="btn-primary auth-btn w-full mt-4" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>{{ isSetupMode ? 'Verify & Activate' : 'Verify Code' }}</span>
        </button>
        
        <button type="button" class="btn-secondary w-full mt-3" @click="cancelMfa">
            Cancel
        </button>
      </form>
    </div>

    <!-- INITIAL LOGIN / REGISTER FLOW -->
    <div v-else>
      <div class="auth-header">
        <h2 v-if="isRegister">Create Account</h2>
        <h2 v-else>Welcome Back</h2>
        <p>Securely access your personalized health data</p>
      </div>

      <div class="card auth-card">
        <form @submit.prevent="handleAuth">
          
          <div v-if="errors.general" class="alert error-text mb-4 text-center">
            ⚠️ {{ errors.general }}
          </div>

          <div class="form-group input-with-icon">
            <label for="email">Email</label>
            <div class="input-wrapper">
                <span class="input-icon">✉️</span>
                <input 
                  id="email" 
                  type="email" 
                  v-model="email" 
                  placeholder="name@example.com"
                  :class="{ 'border-error': errors.email }"
                >
            </div>
            <span v-if="errors.email" class="error-text">⚠️ {{ errors.email }}</span>
          </div>

          <div class="form-group input-with-icon">
            <label for="password">Password</label>
            <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input 
                  id="password" 
                  type="password" 
                  v-model="password" 
                  placeholder="••••••••"
                  :class="{ 'border-error': errors.password }"
                >
            </div>
            <span v-if="errors.password" class="error-text">⚠️ {{ errors.password }}</span>
            <p v-if="isRegister" class="helper-text mt-1 text-xs text-gray-500">Passwords must be at least 8 characters</p>
          </div>

          <button type="submit" class="btn-primary auth-btn" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            <span v-else>{{ isRegister ? 'Continue' : 'Sign In' }}</span>
          </button>
        </form>

        <div class="auth-toggle">
          <span v-if="isRegister">
            Already have an account? <a href="#" @click.prevent="toggleMode">Sign in</a>
          </span>
          <span v-else>
            Don't have an account? <a href="#" @click.prevent="toggleMode">Sign up</a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc(100vh - 40px);
    padding: var(--spacing-md) 0;
}

.logo-mark {
    text-align: center;
    margin-bottom: var(--spacing-lg);
}

.logo-mark .icon {
    font-size: 40px;
    display: block;
    margin-bottom: 8px;
    /* Optional rotation animation */
    animation: float 4s ease-in-out infinite;
}

@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
}

.logo-mark h1 {
    margin: 0;
    font-size: 28px;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.auth-header {
    text-align: center;
    margin-bottom: var(--spacing-lg);
}
.auth-header h2 {
    margin: 0 0 var(--spacing-sm);
    font-size: 26px;
    color: var(--text-color);
}
.auth-header p {
    margin: 0;
    color: var(--text-light);
    font-size: 15px;
}

.auth-card {
    padding: 32px 24px;
    border: none;
    box-shadow: var(--shadow-xl);
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 16px;
    font-size: 20px;
    pointer-events: none;
    opacity: 0.6;
}

.input-wrapper input {
    padding-left: 48px; /* Room for icon */
    background: #f8fafc;
    border-color: #e2e8f0;
}

.input-wrapper input:focus {
    background: white;
}

.helper-text {
    font-size: 13px;
    color: var(--text-light);
    margin: 6px 0 0 4px;
}

.border-error {
    border-color: var(--warning-color) !important;
    background: #fef2f2 !important;
}

.auth-btn {
    margin-top: 32px;
    font-size: 18px; /* slightly larger for main action */
}

.auth-toggle {
    margin-top: 24px;
    text-align: center;
    font-size: 15px;
    color: var(--text-light);
}
.auth-toggle a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
}

.auth-toggle a:hover {
    color: var(--primary-hover);
    text-decoration: underline;
}

.qr-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 150px;
    margin: 16px 0;
}

.qr-code {
    max-width: 150px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px;
    background: white;
}

.qr-placeholder {
    width: 40px;
    height: 40px;
}

.btn-secondary {
    background: transparent;
    color: var(--text-light);
    border: 1px solid #e2e8f0;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.2s;
}

.btn-secondary:hover {
    background: #f8fafc;
    color: var(--text-color);
}
</style>
