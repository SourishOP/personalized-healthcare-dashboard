<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
    logs: {
        type: Array,
        default: () => []
    },
    type: {
        type: String,
        default: 'BLOOD_PRESSURE'
    }
})

const chartData = computed(() => {
    // Filter logs by type and sort by date
    const relevantLogs = props.logs
        .filter(l => l.log_type === props.type)
        .sort((a, b) => new Date(a.logged_at) - new Date(b.logged_at));
    
    // Check if value is numeric or compound (e.g. "120/80")
    // Simple parser for single numbers for now, or just plotting systole
    const dataPoints = relevantLogs.map(l => {
        const val = parseFloat(l.value);
        return isNaN(val) ? 0 : val;
    });

    return {
        labels: relevantLogs.map(l => new Date(l.logged_at).toLocaleDateString()),
        datasets: [
            {
                label: props.type,
                backgroundColor: '#007bff',
                borderColor: '#007bff',
                data: dataPoints
            }
        ]
    }
})

const options = {
    responsive: true,
    maintainAspectRatio: false
}
</script>

<template>
  <div class="chart-container">
    <Line :data="chartData" :options="options" v-if="chartData.datasets[0].data.length > 0" />
    <div v-else class="no-data">No data available for {{ type }}</div>
  </div>
</template>

<style scoped>
.chart-container {
    height: 300px;
    width: 100%;
}
.no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: var(--secondary-color);
}
</style>
