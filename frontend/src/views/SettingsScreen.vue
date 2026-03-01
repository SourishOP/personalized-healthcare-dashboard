<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ToastNotification from '../components/ToastNotification.vue'

const router = useRouter()
const auth = useAuthStore()
const isExporting = ref(false)
const toastShow = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const showToast = (msg, type = 'success') => {
    toastMessage.value = msg
    toastType.value = type
    toastShow.value = true
    setTimeout(() => { toastShow.value = false }, 3000)
}

const exportPDF = () => {
    isExporting.value = true
    
    // Simulate generation time
    setTimeout(() => {
        isExporting.value = false
        showToast('Download Complete: report_dec2023.pdf')
    }, 2000)
}

const logout = () => {
    auth.logout()
}
</script>

<template>
  <div class="settings-container">
    <div class="page-header">
      <h2>App Settings</h2>
      <p class="subtitle">Customize your experience</p>
    </div>
    
    <div class="card settings-card">
      <div class="menu-item group" tabindex="0">
        <div class="menu-content">
            <span class="icon bg-indigo">👤</span>
            <div class="menu-text">
                <span class="menu-title">Profile Details</span>
                <span class="menu-desc">Personal info and goals</span>
            </div>
        </div>
        <span class="arrow">›</span>
      </div>
      
      <div class="menu-item group" tabindex="0">
        <div class="menu-content">
            <span class="icon bg-teal">🔒</span>
            <div class="menu-text">
                <span class="menu-title">Security & MFA</span>
                <span class="menu-desc">Password and 2FA settings</span>
            </div>
        </div>
        <span class="arrow">›</span>
      </div>
      
      <div class="menu-item group" tabindex="0">
        <div class="menu-content">
            <span class="icon bg-rose">🔔</span>
            <div class="menu-text">
                <span class="menu-title">Notifications</span>
                <span class="menu-desc">Push and email alerts</span>
            </div>
        </div>
        <span class="arrow">›</span>
      </div>
    </div>

    <div class="action-container">
      <button class="btn-primary export-btn" @click="exportPDF" :disabled="isExporting">
        <span v-if="isExporting" class="spinner"></span>
        <span v-else>📄 Export PDF Report</span>
      </button>

      <!-- Consistent, but distinct warning color for destructive action -->
      <button class="btn-danger logout-btn" @click="logout">
        Log Out
      </button>
    </div>

    <ToastNotification :show="toastShow" :message="toastMessage" :type="toastType" />
  </div>
</template>

<style scoped>
.settings-container {
    padding-bottom: 80px;
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


.settings-card {
    padding: 0;
    overflow: hidden;
    background: white;
    box-shadow: var(--shadow-md);
    border: none;
}

.menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.menu-item:last-child {
    border-bottom: none;
}

.menu-item:hover, .menu-item:focus {
    background-color: #f8fafc;
    outline: none;
}

.menu-content {
    display: flex;
    align-items: center;
    gap: 16px;
}

.icon {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    font-size: 20px;
}

.bg-indigo { background: #e0e7ff; }
.bg-teal { background: #ccfbf1; }
.bg-rose { background: #ffe4e6; }

.menu-text {
    display: flex;
    flex-direction: column;
}

.menu-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 2px;
}

.menu-desc {
    font-size: 13px;
    color: var(--text-light);
}

.arrow {
    font-size: 24px;
    color: #cbd5e1;
    font-weight: 300;
    transition: transform 0.2s;
}

.menu-item:hover .arrow {
    transform: translateX(4px);
    color: var(--primary-color);
}

.action-container {
    margin-top: calc(var(--spacing-lg) * 1.5);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.export-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
}

.export-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.logout-btn {
    margin-top: var(--spacing-sm);
    font-weight: 700;
}
</style>
