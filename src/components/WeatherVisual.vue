<template>
  <div class="weather-visual-container">
    <!-- Sunny / Clear -->
    <div v-if="type === 'sunny'" class="weather-icon sunny">
      <div class="sun">
        <div class="rays"></div>
      </div>
    </div>

    <!-- Cloudy / Partly Cloudy -->
    <div v-else-if="type === 'cloudy'" class="weather-icon cloudy">
      <div class="cloud-group">
        <div class="cloud small"></div>
        <div class="cloud main"></div>
      </div>
      <div v-if="isPartly" class="sun-behind"></div>
    </div>

    <!-- Overcast -->
    <div v-else-if="type === 'overcast'" class="weather-icon overcast">
      <div class="cloud-group">
        <div class="cloud dark"></div>
        <div class="cloud main"></div>
      </div>
    </div>

    <!-- Rain -->
    <div v-else-if="type === 'rain'" class="weather-icon rainy">
      <div class="cloud-group">
        <div class="cloud main"></div>
      </div>
      <div class="rain-drops">
        <span class="drop"></span>
        <span class="drop"></span>
        <span class="drop"></span>
      </div>
    </div>

    <!-- Thunder -->
    <div v-else-if="type === 'thunder'" class="weather-icon thunder">
      <div class="cloud-group">
        <div class="cloud dark"></div>
      </div>
      <div class="lightning">
        <div class="bolt"></div>
      </div>
    </div>

    <!-- Fog -->
    <div v-else-if="type === 'fog'" class="weather-icon fog">
      <div class="mist-lines">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
    </div>

    <!-- Default -->
    <div v-else class="weather-icon unknown">
      <div class="circle"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeatherVisual',
  props: {
    weather: {
      type: String,
      default: ''
    }
  },
  computed: {
    type() {
      const w = this.weather || '';
      if (w.includes('雷')) return 'thunder';
      if (w.includes('雨')) return 'rain';
      if (w.includes('霧')) return 'fog';
      if (w.includes('陰')) return 'overcast';
      if (w.includes('多雲')) return 'cloudy';
      if (w.includes('晴')) return 'sunny';
      return 'unknown';
    },
    isPartly() {
      const w = this.weather || '';
      return w.includes('晴') && w.includes('多雲');
    }
  }
}
</script>

<style scoped>
.weather-visual-container {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Common Shapes */
.cloud {
  position: absolute;
  width: 36px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid var(--neo-text);
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  z-index: 2;
}

.cloud::after {
  content: '';
  position: absolute;
  top: -10px;
  left: 6px;
  width: 16px;
  height: 16px;
  border-top: 2px solid var(--neo-text);
  border-left: 2px solid var(--neo-text);
  border-right: 2px solid var(--neo-text);
  border-radius: 50% 50% 0 0;
  background: transparent;
}

.cloud.main {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: float 4s ease-in-out infinite;
}

.cloud.small {
  width: 24px;
  height: 14px;
  top: 35%;
  left: 65%;
  opacity: 0.7;
  animation: float 5s ease-in-out infinite reverse;
}

.cloud.dark {
  background: rgba(100, 116, 139, 0.3);
  border-color: #94a3b8;
}

/* Sunny */
.sunny .sun {
  width: 24px;
  height: 24px;
  background: radial-gradient(circle, #ffd700 30%, transparent 70%);
  border: 2px solid #ffd700;
  border-radius: 50%;
  box-shadow: 0 0 15px #ffd700;
  position: relative;
  animation: pulse 3s infinite;
}

.sunny .rays {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 2px dashed rgba(255, 215, 0, 0.5);
  border-radius: 50%;
  animation: spin 10s linear infinite;
}

/* Cloudy with Sun */
.sun-behind {
  position: absolute;
  width: 16px;
  height: 16px;
  background: #ffd700;
  border-radius: 50%;
  top: 25%;
  left: 60%;
  box-shadow: 0 0 10px #ffd700;
  z-index: 1;
  animation: pulse 4s infinite;
}

/* Rain */
.rain-drops {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 20px;
  z-index: 1;
}

.drop {
  position: absolute;
  width: 2px;
  height: 6px;
  background: #00f2ff;
  border-radius: 2px;
  box-shadow: 0 0 5px #00f2ff;
  animation: rain 1s linear infinite;
}

.drop:nth-child(1) { left: 20%; animation-delay: 0s; }
.drop:nth-child(2) { left: 50%; animation-delay: 0.3s; }
.drop:nth-child(3) { left: 80%; animation-delay: 0.6s; }

/* Thunder */
.lightning {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.bolt {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 15px solid #ffd700;
  transform: skew(-15deg);
  filter: drop-shadow(0 0 5px #ffd700);
  animation: flash 2s infinite;
}

/* Fog */
.mist-lines .line {
  width: 30px;
  height: 3px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 3px;
  margin: 4px auto;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  animation: mist 3s ease-in-out infinite;
}

.mist-lines .line:nth-child(2) { width: 40px; animation-delay: 0.5s; }
.mist-lines .line:nth-child(3) { width: 20px; animation-delay: 1s; }

/* Animations */
@keyframes float {
  0%, 100% { transform: translate(-50%, -50%) translateY(0); }
  50% { transform: translate(-50%, -50%) translateY(-4px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

@keyframes spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes rain {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(15px); opacity: 0; }
}

@keyframes flash {
  0%, 90%, 100% { opacity: 0; }
  92%, 96% { opacity: 1; }
  94%, 98% { opacity: 0; }
}

@keyframes mist {
  0%, 100% { transform: translateX(-2px); opacity: 0.5; }
  50% { transform: translateX(2px); opacity: 0.8; }
}
</style>