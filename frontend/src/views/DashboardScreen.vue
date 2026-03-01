<script setup>
import { ref } from 'vue'

const isSyncing = ref(false)
const syncStatus = ref('APIs Synced Just Now')
const syncColor = ref('var(--success-color)')

const triggerSync = () => {
    isSyncing.value = true
    syncStatus.value = 'Syncing...'
    syncColor.value = 'var(--text-light)'
    
    setTimeout(() => {
        isSyncing.value = false
        // Randomize success/fail for demo
        if (Math.random() > 0.2) {
             syncStatus.value = 'APIs Synced Just Now'
             syncColor.value = 'var(--success-color)'
        } else {
             syncStatus.value = 'Sync Failed'
             syncColor.value = 'var(--warning-color)'
        }
    }, 1500)
}
</script>

<template>
  <div class="dashboard">
    <div class="sync-status" @click="triggerSync">
      <span class="status-dot" :style="{ backgroundColor: syncColor }"></span>
      <span class="status-text">{{ syncStatus }}</span>
      <span v-if="isSyncing" class="spinner-small"></span>
    </div>

    <h2>Today's Summary</h2>

    <div class="card summary-card bg-blue">
      <div class="card-icon">❤️</div>
      <div class="card-content">
        <h3>Blood Pressure</h3>
        <p class="metric">120/80 <span class="unit">mmHg</span></p>
      </div>
    </div>

    <div class="card summary-card bg-green">
      <div class="card-icon">💊</div>
      <div class="card-content">
        <h3>Next Medication</h3>
        <p class="metric">Aspirin 81mg</p>
        <p class="sub-text">In 2 hours</p>
      </div>
    </div>

    <div class="card summary-card bg-orange">
      <div class="card-icon">👟</div>
      <div class="card-content">
        <h3>Steps Walked</h3>
        <p class="metric">6,432 <span class="unit">steps</span></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sync-status {
    display: inline-flex;
    align-items: center;
    background: var(--card-bg);
    padding: 8px 16px;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    margin-bottom: var(--spacing-lg);
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}
.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
    transition: background-color 0.3s;
}
.spinner-small {
    width: 12px;
    height: 12px;
    border: 2px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-left: 8px;
}

.summary-card {
    display: flex;
    align-items: center;
    gap: 16px;
    border-left: 4px solid var(--primary-color);
}
.bg-blue { border-left-color: #007bff; }
.bg-green { border-left-color: #28a745; }
.bg-orange { border-left-color: #fd7e14; }

.card-icon {
    font-size: 32px;
    background: var(--bg-color);
    padding: 12px;
    border-radius: 12px;
}
.card-content h3 {
    margin: 0 0 4px 0;
    font-size: 14px;
    color: var(--text-light);
}
.metric {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
}
.unit {
    font-size: 14px;
    font-weight: normal;
    color: var(--text-light);
}
.sub-text {
    margin: 4px 0 0 0;
    font-size: 13px;
    color: var(--text-light);
}
</style>
