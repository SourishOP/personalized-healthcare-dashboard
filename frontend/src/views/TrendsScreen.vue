<script setup>
import { ref, onMounted } from 'vue'
// For the assignment, we'll build a custom simple SVG line chart layout as requested 
// "A line chart container for health metrics"

const timeframes = ['1W', '1M', '3M']
const activeTimeframe = ref('1W')

const toggleTimeframe = (tf) => {
    activeTimeframe.value = tf
    // Trigger mock animation
    animateChart.value = false
    setTimeout(() => { animateChart.value = true }, 50)
}

const animateChart = ref(true)

// Mock data points for SVG
const points = [
    { x: 0, y: 70 },
    { x: 20, y: 50 },
    { x: 40, y: 65 },
    { x: 60, y: 40 },
    { x: 80, y: 80 },
    { x: 100, y: 60 }
]

const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ')
</script>

<template>
  <div class="trends-container">
    <h2>Health Trends</h2>

    <!-- Segmented Control -->
    <div class="segmented-control">
      <button 
        v-for="tf in timeframes" 
        :key="tf"
        @click="toggleTimeframe(tf)"
        :class="{ active: activeTimeframe === tf }"
        class="segment-btn"
      >
        {{ tf }}
      </button>
    </div>

    <!-- Chart Container -->
    <div class="card chart-card">
      <div class="chart-header">
        <h3>Blood Pressure (Systolic)</h3>
        <span class="avg-badge">Avg: 118</span>
      </div>
      
      <div class="chart-area" :class="{ 'animate-in': animateChart }">
        <!-- SVG Line Chart Mockup -->
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="line-chart">
            <polyline
                fill="none"
                stroke="var(--primary-color)"
                stroke-width="3"
                :points="polylinePoints"
                vector-effect="non-scaling-stroke"
                class="chart-line"
            />
            <!-- Data points -->
            <circle v-for="(p, i) in points" :key="i" :cx="p.x" :cy="p.y" r="2" fill="var(--primary-color)" />
        </svg>

        <!-- Y Axis Guidelines -->
        <div class="grid-lines">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
        </div>
      </div>
      
      <div class="x-axis">
        <span>Mon</span>
        <span>Wed</span>
        <span>Fri</span>
        <span>Sun</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.segmented-control {
    display: flex;
    background: #e9ecef;
    border-radius: 24px;
    padding: 4px;
    margin-bottom: var(--spacing-lg);
}

.segment-btn {
    flex: 1;
    background: transparent;
    color: var(--text-light);
    border-radius: 20px;
    min-height: 40px;
    font-size: 14px;
    transition: all 0.3s ease;
}

.segment-btn.active {
    background: var(--card-bg);
    color: var(--text-color);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    font-weight: 700;
}

.chart-card {
    padding: var(--spacing-md);
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.chart-header h3 {
    margin: 0;
    font-size: 15px;
}

.avg-badge {
    background: rgba(0, 123, 255, 0.1);
    color: var(--primary-color);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.chart-area {
    position: relative;
    height: 200px;
    margin-bottom: var(--spacing-md);
    overflow: hidden; /* For mobile swiping paradigm if implemented */
}

.line-chart {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    overflow: visible;
}

.chart-line {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
}

.animate-in .chart-line {
    animation: draw 1.5s ease forwards;
}

@keyframes draw {
    to { stroke-dashoffset: 0; }
}

.grid-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 1;
}

.grid-lines .line {
    width: 100%;
    border-top: 1px dashed var(--border-color);
}

.x-axis {
    display: flex;
    justify-content: space-between;
    color: var(--text-light);
    font-size: 12px;
    padding: 0 10px;
}
</style>
