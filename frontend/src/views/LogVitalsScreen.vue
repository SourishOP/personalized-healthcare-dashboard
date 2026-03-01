<script setup>
import { ref } from 'vue'
import ToastNotification from '../components/ToastNotification.vue'

const bpSystolic = ref('')
const bpDiastolic = ref('')
const glucose = ref('')
const isLoading = ref(false)

const toastShow = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const showToast = (msg, type = 'success') => {
    toastMessage.value = msg
    toastType.value = type
    toastShow.value = true
    setTimeout(() => { toastShow.value = false }, 3000)
}

const saveLogs = () => {
    if (!bpSystolic.value && !bpDiastolic.value && !glucose.value) {
        showToast('Please enter at least one vital sign.', 'error')
        return
    }

    isLoading.value = true
    
    // Simulate API delay
    setTimeout(() => {
        isLoading.value = false
        showToast('Vitals logged successfully')
        bpSystolic.value = ''
        bpDiastolic.value = ''
        glucose.value = ''
    }, 1200)
}
</script>

<template>
  <div>
    <h2>Log Vitals</h2>
    <p class="subtitle">Enter your latest readings</p>

    <div class="card">
      <form @submit.prevent="saveLogs">
        <h3 class="section-title">Blood Pressure</h3>
        <div class="bp-inputs">
            <div class="form-group">
                <label>Systolic (Top)</label>
                <input type="number" inputmode="numeric" v-model="bpSystolic" placeholder="120">
            </div>
            <span class="divider">/</span>
            <div class="form-group">
                <label>Diastolic (Bottom)</label>
                <input type="number" inputmode="numeric" v-model="bpDiastolic" placeholder="80">
            </div>
        </div>

        <h3 class="section-title">Blood Glucose</h3>
        <div class="form-group">
            <label>Level (mg/dL)</label>
            <input type="number" inputmode="numeric" v-model="glucose" placeholder="95">
        </div>

        <div class="button-container">
            <button type="submit" class="btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="spinner"></span>
                <span v-else>Save Log</span>
            </button>
        </div>
      </form>
    </div>

    <ToastNotification :show="toastShow" :message="toastMessage" :type="toastType" />
  </div>
</template>

<style scoped>
.subtitle {
    color: var(--text-light);
    margin-top: -10px;
    margin-bottom: var(--spacing-lg);
}
.section-title {
    font-size: 16px;
    color: var(--primary-color);
    margin-top: 0;
    margin-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: var(--spacing-sm);
}
.bp-inputs {
    display: flex;
    align-items: center;
    gap: 12px;
}
.bp-inputs .form-group {
    flex: 1;
}
.divider {
    font-size: 24px;
    color: var(--text-light);
    margin-top: 5px; /* aligns roughly with inputs */
}
.button-container {
    margin-top: var(--spacing-lg);
}
</style>
