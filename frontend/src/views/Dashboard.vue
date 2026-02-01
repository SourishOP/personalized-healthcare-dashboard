<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import HealthChart from '../components/HealthChart.vue'

const auth = useAuthStore()
const logs = ref([])
const reminders = ref([])
const loading = ref(true)

// Form Data for New Log
const newLog = ref({
    log_type: 'BLOOD_PRESSURE',
    value: '',
    notes: ''
})

const fetchMethods = async () => {
    try {
        const [logsRes, remindRes] = await Promise.all([
            axios.get('/api/logs'),
            axios.get('/api/reminders')
        ]);
        logs.value = logsRes.data
        reminders.value = remindRes.data
    } catch (err) {
        console.error("Failed to fetch dashboard data", err)
    } finally {
        loading.value = false
    }
}

const addLog = async () => {
    try {
        await axios.post('/api/logs', newLog.value);
        newLog.value.value = ''; // Reset
        newLog.value.notes = '';
        await fetchMethods(); // Refresh
    } catch (err) {
        alert(err.response?.data?.message || 'Error adding log');
    }
}

const logout = () => {
    auth.logout();
}

onMounted(() => {
    fetchMethods()
})
</script>

<template>
  <div class="dashboard">
    <div class="header">
        <h2>Dashboard</h2>
        <button @click="logout" class="btn-secondary">Logout</button>
    </div>

    <div v-if="loading">Loading...</div>
    
    <div v-else class="grid">
        <!-- Visualization Card -->
        <div class="card chart-section">
            <h3>Health Trends</h3>
            <HealthChart :logs="logs" type="BLOOD_PRESSURE" />
        </div>

        <!-- Reminders Card -->
        <div class="card reminders-section">
            <h3>Reminders</h3>
            <ul v-if="reminders.length">
                <li v-for="r in reminders" :key="r.id">
                    <strong>{{ r.title }}</strong> (Every {{ r.frequency_minutes }} mins)
                </li>
            </ul>
            <p v-else>No active reminders.</p>
        </div>

        <!-- Add Log Card -->
        <div class="card add-log-section">
            <h3>Add Vitals/Symptom</h3>
            <form @submit.prevent="addLog">
                <div class="form-group">
                    <label>Type</label>
                    <select v-model="newLog.log_type">
                        <option value="BLOOD_PRESSURE">Blood Pressure</option>
                        <option value="GLUCOSE">Glucose</option>
                        <option value="MOOD">Mood</option>
                        <option value="WEIGHT">Weight</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Value</label>
                    <input type="text" v-model="newLog.value" placeholder="e.g. 120" required />
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <input type="text" v-model="newLog.notes" />
                </div>
                <button type="submit" class="btn-primary">Add Log</button>
            </form>
        </div>

        <!-- Recent Logs List -->
        <div class="card logs-section">
            <h3>Recent Logs</h3>
            <div class="log-list">
                <div v-for="log in logs" :key="log.id" class="log-item">
                    <span class="type">{{ log.log_type }}</span>
                    <span class="value">{{ log.value }}</span>
                    <span class="date">{{ new Date(log.logged_at).toLocaleString() }}</span>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
}
.chart-section {
    grid-column: 1 / -1; 
}
.log-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
}
.btn-secondary {
    background: #6c757d;
    color: white;
}
select {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
@media (min-width: 768px) {
    .chart-section { grid-column: span 2; }
}
</style>
