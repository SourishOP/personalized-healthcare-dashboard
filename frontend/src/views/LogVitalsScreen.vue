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
        showToast('Please enter at least one vital sign', 'error')
        return
    }

    isLoading.value = true
    
    // Simulate API delay
    setTimeout(() => {
        isLoading.value = false
        showToast('Vitals logged securely')
        bpSystolic.value = ''
        bpDiastolic.value = ''
        glucose.value = ''
    }, 1200)
}
</script>

<template>
  <div class="log-container">
    <div class="page-header">
      <h2>Log Vitals</h2>
      <p class="subtitle">Record today's health metrics</p>
    </div>

    <form @submit.prevent="saveLogs" class="log-form">
      <div class="card vital-card">
        <div class="vital-header">
            <span class="vital-icon bg-red">❤️</span>
            <h3 class="section-title">Blood Pressure</h3>
        </div>
        
        <div class="bp-inputs">
            <div class="form-group">
                <label>Systolic (Top)</label>
                <div class="input-with-unit">
                    <input type="number" inputmode="numeric" v-model="bpSystolic" placeholder="120">
                    <span class="unit-label">mmHg</span>
                </div>
            </div>
            <span class="divider">/</span>
            <div class="form-group">
                <label>Diastolic (Bottom)</label>
                <div class="input-with-unit">
                    <input type="number" inputmode="numeric" v-model="bpDiastolic" placeholder="80">
                    <span class="unit-label">mmHg</span>
                </div>
            </div>
        </div>
      </div>

      <div class="card vital-card">
        <div class="vital-header">
            <span class="vital-icon bg-blue">🩸</span>
            <h3 class="section-title">Blood Glucose</h3>
        </div>
        
        <div class="form-group">
            <label>Current Level</label>
            <div class="input-with-unit">
                <input type="number" inputmode="numeric" v-model="glucose" placeholder="95">
                <span class="unit-label">mg/dL</span>
            </div>
        </div>
      </div>

      <div class="floating-action">
          <button type="submit" class="btn-primary shadow-btn" :disabled="isLoading">
              <span v-if="isLoading" class="spinner"></span>
              <span v-else>Save Metrics</span>
          </button>
      </div>
    </form>

    <ToastNotification :show="toastShow" :message="toastMessage" :type="toastType" />
  </div>
</template>

<style scoped>
.log-container {
    padding-top: var(--spacing-sm);
    padding-bottom: 80px; /* Leave space for bottom nav AND fab */
}

.page-header {
    margin-bottom: var(--spacing-lg);
}

.page-header h2 {
    margin: 0 0 4px 0;
    font-size: 28px;
    color: var(--text-color);
}

.subtitle {
    color: var(--text-light);
    margin: 0;
    font-size: 15px;
}

.vital-card {
    border-top: 4px solid transparent;
    transition: transform 0.2s, box-shadow 0.2s;
}

.vital-card:focus-within {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.vital-card:nth-of-type(1) { border-top-color: #ef4444; }
.vital-card:nth-of-type(2) { border-top-color: #3b82f6; }

.vital-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: var(--spacing-lg);
}

.vital-icon {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    font-size: 18px;
}

.bg-red { background: #fee2e2; }
.bg-blue { background: #dbeafe; }

.section-title {
    font-size: 18px;
    color: var(--text-color);
    margin: 0;
    font-family: 'Outfit', sans-serif;
}

.bp-inputs {
    display: flex;
    align-items: flex-end;
    gap: 12px;
}

.bp-inputs .form-group {
    flex: 1;
    margin-bottom: 0;
}

.input-with-unit {
    position: relative;
    display: flex;
    align-items: center;
}

.input-with-unit input {
    padding-right: 60px; /* Room for unit text */
    font-size: 18px;
    font-weight: 600;
}

.unit-label {
    position: absolute;
    right: 16px;
    color: var(--text-light);
    font-size: 14px;
    font-weight: 500;
    pointer-events: none;
}

.divider {
    font-size: 28px;
    color: var(--border-color);
    margin-bottom: 12px; /* offsets to align with inputs */
    font-weight: 300;
}

.floating-action {
    position: fixed;
    bottom: 90px; /* Above BottomNav */
    left: 0;
    right: 0;
    padding: 0 var(--spacing-lg);
    max-width: 600px;
    margin: 0 auto;
    z-index: 100;
}

.shadow-btn {
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
    height: 56px; /* Extra tall for primary fab feel */
    font-size: 18px;
}
</style>
