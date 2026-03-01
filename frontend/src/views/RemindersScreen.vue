<script setup>
import { ref } from 'vue'

const medications = ref([
    { id: 1, name: 'Metformin', time: '8:00 AM', active: true },
    { id: 2, name: 'Lisinopril', time: '9:00 AM', active: false },
    { id: 3, name: 'Aspirin 81mg', time: '8:00 PM', active: true }
])

const toggleReminder = (med) => {
    med.active = !med.active
}
</script>

<template>
  <div>
    <h2>Reminders</h2>
    <p class="subtitle">Manage your daily medication alerts</p>

    <div class="card" style="padding: 0;">
      <ul class="reminder-list">
        <li v-for="med in medications" :key="med.id" class="reminder-item">
          <div class="med-info">
            <span class="med-name">{{ med.name }}</span>
            <span class="med-time">{{ med.time }}</span>
          </div>
          
          <!-- iOS/Material Style Toggle Switch (Large for touch) -->
          <div 
            class="toggle-switch" 
            :class="{ active: med.active }"
            @click="toggleReminder(med)"
          >
            <div class="toggle-knob"></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.subtitle {
    color: var(--text-light);
    margin-top: -10px;
    margin-bottom: var(--spacing-lg);
}

.reminder-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.reminder-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
}

.reminder-item:last-child {
    border-bottom: none;
}

.med-info {
    display: flex;
    flex-direction: column;
}

.med-name {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 4px;
}

.med-time {
    color: var(--text-light);
    font-size: 14px;
}

/* Custom Large Toggle Switch for Mobile */
.toggle-switch {
    width: 56px;
    height: 32px;
    background-color: var(--border-color);
    border-radius: 16px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s ease;
    /* Increase touch target area */
    padding: 8px;
    box-sizing: content-box;
    background-clip: content-box;
}

.toggle-switch.active {
    background-color: var(--success-color);
}

.toggle-knob {
    width: 28px;
    height: 28px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 10px;
    left: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.toggle-switch.active .toggle-knob {
    transform: translateX(24px);
}
</style>
