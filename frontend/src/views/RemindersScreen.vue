<script setup>
import { ref } from 'vue'

const medications = ref([
    { id: 1, name: 'Metformin', time: '8:00 AM', active: true, icon: '💊', color: 'bg-blue' },
    { id: 2, name: 'Lisinopril', time: '9:00 AM', active: false, icon: '🩸', color: 'bg-red' },
    { id: 3, name: 'Aspirin 81mg', time: '8:00 PM', active: true, icon: '🤍', color: 'bg-gray' }
])

const toggleReminder = (med) => {
    med.active = !med.active
}
</script>

<template>
  <div class="reminders-container">
    <div class="page-header">
      <h2>Reminders</h2>
      <p class="subtitle">Manage your daily medication alerts</p>
    </div>

    <div class="reminder-list">
      <div 
        v-for="med in medications" 
        :key="med.id" 
        class="card reminder-item"
        :class="{ 'inactive-card': !med.active }"
      >
        <div class="med-info-group">
          <div class="med-icon" :class="med.color">
            {{ med.icon }}
          </div>
          <div class="med-details">
            <span class="med-name">{{ med.name }}</span>
            <span class="med-time">
                <span class="time-icon">⏰</span> {{ med.time }}
            </span>
          </div>
        </div>
        
        <!-- iOS/Material Style Toggle Switch (Large for touch) -->
        <div 
          class="toggle-switch" 
          :class="{ active: med.active }"
          @click="toggleReminder(med)"
        >
          <div class="toggle-knob"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reminders-container {
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

.reminder-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.reminder-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    margin-bottom: 0px; /* Overrides default card margin to use flex gap */
    transition: all 0.3s ease;
}

.inactive-card {
    opacity: 0.7;
    background: #f8fafc;
    box-shadow: none;
    border-color: #f1f5f9;
}

.med-info-group {
    display: flex;
    align-items: center;
    gap: 16px;
}

.med-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.bg-blue { background: #dbeafe; }
.bg-red { background: #fee2e2; }
.bg-gray { background: #f1f5f9; }

.med-details {
    display: flex;
    flex-direction: column;
}

.med-name {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 4px;
    color: #1e293b;
    font-family: 'Outfit', sans-serif;
}

.med-time {
    color: var(--text-light);
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
}

.time-icon {
    font-size: 12px;
}

/* Custom Large Toggle Switch for Mobile - Premium Update */
.toggle-switch {
    width: 58px;
    height: 34px;
    background-color: #e2e8f0;
    border-radius: 20px;
    position: relative;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    /* Increase touch target area invisibly */
    padding: 10px;
    margin: -10px;
    box-sizing: content-box;
    background-clip: content-box;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
}

.toggle-switch.active {
    background: var(--success-gradient);
}

.toggle-knob {
    width: 30px;
    height: 30px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 12px; /* 10px padding + 2px offset */
    left: 12px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toggle-switch.active .toggle-knob {
    transform: translateX(24px);
}
</style>
