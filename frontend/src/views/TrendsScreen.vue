<script setup>
import { ref, onMounted } from 'vue'

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
const polygonPoints = `0,100 ${polylinePoints} 100,100`
</script>

<template>
  <div class="trends-container">
    <div class="page-header">
      <h2>Health Trends</h2>
      <p class="subtitle">Monitor your progress over time</p>
    </div>

    <!-- Premium Segmented Control -->
    <div class="segmented-control">
      <div class="segment-highlight" :style="{ transform: `translateX(${timeframes.indexOf(activeTimeframe) * 100}%)` }"></div>
      <button 
        v-for="tf in timeframes" 
        :key="tf"
        @click="toggleTimeframe(tf)"
        :class="{ active: activeTimeframe === tf }"
        class="segment-btn relative-z"
      >
        {{ tf }}
      </button>
    </div>

    <!-- Chart Container -->
    <div class="card chart-card">
      <div class="chart-header">
        <div class="chart-title-group">
            <span class="chart-icon">❤️</span>
            <h3>Blood Pressure (Systolic)</h3>
        </div>
        <span class="avg-badge">Avg: 118 <span class="unit">mmHg</span></span>
      </div>
      
      <div class="chart-area" :class="{ 'animate-in': animateChart }">
        <!-- SVG Line Chart Mockup -->
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="line-chart">
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.01"/>
                </linearGradient>
            </defs>
            <polygon :points="polygonPoints" fill="url(#chartGradient)" class="chart-fill" />
            <polyline
                fill="none"
                stroke="var(--primary-color)"
                stroke-width="3"
                :points="polylinePoints"
                vector-effect="non-scaling-stroke"
                class="chart-line"
            />
            <!-- Data points -->
            <circle v-for="(p, i) in points" :key="i" :cx="p.x" :cy="p.y" r="3" fill="#ffffff" stroke="var(--primary-color)" stroke-width="2" class="chart-point" />
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
.trends-container {
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

.segmented-control {
    display: flex;
    background: #e2e8f0;
    border-radius: 24px;
    padding: 4px;
    margin-bottom: var(--spacing-lg);
    position: relative;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
}

.segment-highlight {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 4px;
    width: calc((100% - 8px) / 3);
    background: white;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    z-index: 1;
}

.relative-z {
    z-index: 2;
}

.segment-btn {
    flex: 1;
    background: transparent;
    color: var(--text-light);
    border-radius: 20px;
    min-height: 44px; /* slightly taller for better touch */
    font-size: 14px;
    font-weight: 500;
    transition: color 0.3s ease;
}

.segment-btn.active {
    color: var(--primary-color);
    font-weight: 700;
}

.chart-card {
    padding: 24px;
    background: linear-gradient(180deg, #ffffff 0%, #fefeff 100%);
    border: 1px solid #f1f5f9;
}

.chart-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: var(--spacing-lg);
}

.chart-title-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.chart-icon {
    font-size: 20px;
    background: #fee2e2;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
}

.chart-header h3 {
    margin: 0;
    font-size: 16px;
    color: #334155;
}

.avg-badge {
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
    color: #4338ca;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    align-self: flex-start;
}

.avg-badge .unit {
    font-size: 12px;
    font-weight: 500;
    color: #4f46e5;
}

.chart-area {
    position: relative;
    height: 220px;
    margin-bottom: var(--spacing-md);
    overflow: hidden; 
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

.chart-fill {
    opacity: 0;
    transform-origin: bottom;
    transform: scaleY(0);
}

.chart-point {
    opacity: 0;
}

.animate-in .chart-line {
    animation: draw 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.animate-in .chart-fill {
    animation: rise 0.8s ease forwards;
    animation-delay: 0.4s;
}

.animate-in .chart-point {
    animation: fadeIn 0.4s ease forwards;
}
/* Stagger point animations */
.animate-in circle:nth-child(n) { animation-delay: calc(var(--i, 0.5s) + 0.5s); }

@keyframes draw {
    to { stroke-dashoffset: 0; }
}

@keyframes rise {
    to { opacity: 1; transform: scaleY(1); }
}

@keyframes fadeIn {
    to { opacity: 1; }
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
    border-top: 1px dashed #e2e8f0;
}

.x-axis {
    display: flex;
    justify-content: space-between;
    color: var(--text-light);
    font-size: 12px;
    font-weight: 500;
    padding: 0 4px;
    margin-top: 8px;
}
</style>
