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
    <div class="header-section">
      <div>
        <h2 class="greeting">Good Morning, Sourish</h2>
        <p class="date-text">Monday, Oct 24</p>
      </div>
      <div class="avatar">
        <span>S</span>
      </div>
    </div>

    <div class="sync-status" @click="triggerSync" :class="{ 'syncing': isSyncing }">
      <div class="sync-content">
        <span class="status-dot" :style="{ backgroundColor: syncColor, boxShadow: `0 0 8px ${syncColor}` }"></span>
        <span class="status-text">{{ syncStatus }}</span>
      </div>
      <span v-if="isSyncing" class="spinner-small"></span>
      <span v-else class="sync-icon">🔄</span>
    </div>

    <h3 class="section-title">Today's Summary</h3>

    <div class="card summary-card gradient-blue">
      <div class="card-icon blood-pressure">
        ❤️
      </div>
      <div class="card-content">
        <h4>Blood Pressure</h4>
        <div class="metric-row">
          <p class="metric">120/80</p>
          <span class="unit">mmHg</span>
        </div>
        <div class="trend positive">
          <span>↓ 2% from yesterday</span>
        </div>
      </div>
    </div>

    <div class="card summary-card gradient-green">
      <div class="card-icon meds">
        💊
      </div>
      <div class="card-content">
        <h4>Next Medication</h4>
        <div class="metric-row">
          <p class="metric">Aspirin <span class="unit">81mg</span></p>
        </div>
        <div class="pill-badge time-badge">
          <span>In 2 hours</span>
        </div>
      </div>
    </div>

    <div class="card summary-card gradient-orange">
      <div class="card-icon activity">
        👟
      </div>
      <div class="card-content">
        <h4>Activity Goal</h4>
        <div class="metric-row">
          <p class="metric">6,432</p>
          <span class="unit">/ 10k steps</span>
        </div>
        <!-- Simple progress bar mock -->
        <div class="progress-track">
          <div class="progress-fill" style="width: 64%;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
    padding-top: var(--spacing-sm);
}

.greeting {
    margin: 0;
    font-size: 24px;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.date-text {
    margin: 4px 0 0 0;
    color: var(--text-light);
    font-size: 14px;
    font-weight: 500;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--primary-gradient);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: 600;
    font-size: 20px;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.sync-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 12px 20px;
    border-radius: 100px; /* Fully rounded pill */
    box-shadow: var(--shadow-md);
    margin-bottom: var(--spacing-lg);
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
}

.sync-status:active {
    transform: scale(0.98);
}

.sync-content {
    display: flex;
    align-items: center;
}

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 12px;
    transition: all 0.3s;
}

.sync-icon {
    font-size: 14px;
    color: var(--text-light);
    transition: transform 0.3s;
}

.sync-status:hover .sync-icon {
    transform: rotate(180deg);
}

.spinner-small {
    width: 16px;
    height: 16px;
    border: 2px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.section-title {
    font-size: 18px;
    margin-bottom: var(--spacing-md);
    color: var(--text-color);
}

.summary-card {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    border: none;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.summary-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

/* Beautiful Soft Gradients for Cards */
.gradient-blue { background: linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%); border: 1px solid #e0e7ff; }
.gradient-green { background: linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%); border: 1px solid #d1fae5; }
.gradient-orange { background: linear-gradient(135deg, #ffffff 0%, #fff7ed 100%); border: 1px solid #ffedd5; }

.card-icon {
    font-size: 28px;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    box-shadow: var(--shadow-sm);
    flex-shrink: 0;
}

.blood-pressure { background: #fee2e2; }
.meds { background: #d1fae5; }
.activity { background: #ffedd5; }

.card-content {
    flex-grow: 1;
}

.card-content h4 {
    margin: 0 0 8px 0;
    font-size: 15px;
    color: #4b5563;
    font-weight: 600;
}

.metric-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin-bottom: 8px;
}

.metric {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.02em;
}

.unit {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-light);
}

/* Trend Indicator */
.trend {
    font-size: 12px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 8px;
}
.trend.positive { background: #d1fae5; color: #059669; }

/* Time Badge */
.pill-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
}
.time-badge { background: #e0e7ff; color: #4f46e5; }

/* Progress Track */
.progress-track {
    height: 8px;
    background: #ffedd5;
    border-radius: 4px;
    margin-top: 12px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #f97316 0%, #fb923c 100%);
    border-radius: 4px;
}
</style>
