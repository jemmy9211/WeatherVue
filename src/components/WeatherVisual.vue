<template>
  <div class="weather-icon-box">
    <!-- ☀️ 晴天 -->
    <div v-if="type === 'sunny'" class="icon sunny">
      <svg viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="10" fill="url(#sunGrad)" />
        <g class="sun-rays">
          <line x1="24" y1="2" x2="24" y2="8" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
          <line x1="24" y1="40" x2="24" y2="46" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
          <line x1="2" y1="24" x2="8" y2="24" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
          <line x1="40" y1="24" x2="46" y2="24" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
          <line x1="8.3" y1="8.3" x2="12.5" y2="12.5" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
          <line x1="35.5" y1="35.5" x2="39.7" y2="39.7" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
          <line x1="8.3" y1="39.7" x2="12.5" y2="35.5" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
          <line x1="35.5" y1="12.5" x2="39.7" y2="8.3" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
        </g>
        <defs>
          <radialGradient id="sunGrad" cx="0.3" cy="0.3" r="0.8">
            <stop offset="0%" stop-color="#FFF7E0"/>
            <stop offset="50%" stop-color="#FFD700"/>
            <stop offset="100%" stop-color="#FFA500"/>
          </radialGradient>
        </defs>
      </svg>
    </div>

    <!-- 🌤️ 多雲 / 多雲時晴 -->
    <div v-else-if="type === 'cloudy'" class="icon cloudy">
      <svg viewBox="0 0 48 48" fill="none">
        <!-- 太陽（多雲時晴才顯示） -->
        <g v-if="isPartly" class="sun-behind">
          <circle cx="34" cy="14" r="8" fill="url(#sunSmall)"/>
        </g>
        <!-- 雲 -->
        <path d="M12 36 C6 36 4 30 8 26 C6 22 10 18 16 18 C18 12 26 10 32 14 C38 12 44 16 44 24 C44 32 38 36 32 36 Z" 
          fill="url(#cloudGrad)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
        <defs>
          <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(255,255,255,0.9)"/>
            <stop offset="100%" stop-color="rgba(200,210,230,0.7)"/>
          </linearGradient>
          <radialGradient id="sunSmall" cx="0.3" cy="0.3" r="0.8">
            <stop offset="0%" stop-color="#FFF7E0"/>
            <stop offset="100%" stop-color="#FFD700"/>
          </radialGradient>
        </defs>
      </svg>
    </div>

    <!-- ☁️ 陰天 -->
    <div v-else-if="type === 'overcast'" class="icon overcast">
      <svg viewBox="0 0 48 48" fill="none">
        <!-- 後方深色雲 -->
        <path d="M16 32 C10 32 8 26 12 23 C10 20 14 16 20 16 C22 11 28 10 34 14 C38 12 44 16 42 22 C46 24 44 32 38 32 Z" 
          fill="rgba(100,116,139,0.5)" stroke="rgba(148,163,184,0.4)" stroke-width="1" transform="translate(-4, -4)"/>
        <!-- 前方主雲 -->
        <path d="M12 38 C6 38 4 32 8 28 C6 24 10 20 16 20 C18 14 26 12 32 16 C38 14 44 18 44 26 C44 34 38 38 32 38 Z" 
          fill="url(#overcastGrad)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        <defs>
          <linearGradient id="overcastGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(180,190,210,0.9)"/>
            <stop offset="100%" stop-color="rgba(140,150,170,0.7)"/>
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- 🌧️ 下雨 -->
    <div v-else-if="type === 'rain'" class="icon rainy">
      <svg viewBox="0 0 48 48" fill="none">
        <!-- 雲 -->
        <path d="M10 28 C4 28 2 22 6 18 C4 14 8 10 14 10 C16 4 24 2 30 6 C36 4 42 8 42 16 C42 24 36 28 30 28 Z" 
          fill="url(#rainCloudGrad)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        <!-- 雨滴 -->
        <g class="rain-drops">
          <line x1="14" y1="32" x2="12" y2="42" stroke="url(#dropGrad)" stroke-width="2" stroke-linecap="round"/>
          <line x1="24" y1="34" x2="22" y2="44" stroke="url(#dropGrad)" stroke-width="2" stroke-linecap="round"/>
          <line x1="34" y1="32" x2="32" y2="42" stroke="url(#dropGrad)" stroke-width="2" stroke-linecap="round"/>
        </g>
        <defs>
          <linearGradient id="rainCloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(160,175,200,0.9)"/>
            <stop offset="100%" stop-color="rgba(120,135,160,0.8)"/>
          </linearGradient>
          <linearGradient id="dropGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#00D4FF"/>
            <stop offset="100%" stop-color="#0080FF"/>
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- ⛈️ 雷雨 -->
    <div v-else-if="type === 'thunder'" class="icon thunder">
      <svg viewBox="0 0 48 48" fill="none">
        <!-- 深色雲 -->
        <path d="M10 26 C4 26 2 20 6 16 C4 12 8 8 14 8 C16 2 24 0 30 4 C36 2 42 6 42 14 C42 22 36 26 30 26 Z" 
          fill="url(#thunderCloudGrad)" stroke="rgba(148,163,184,0.4)" stroke-width="1"/>
        <!-- 閃電 -->
        <path class="lightning-bolt" d="M26 24 L22 32 L26 32 L22 44 L32 30 L27 30 L32 24 Z" 
          fill="url(#boltGrad)" stroke="#FFA500" stroke-width="0.5"/>
        <defs>
          <linearGradient id="thunderCloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(100,110,130,0.95)"/>
            <stop offset="100%" stop-color="rgba(60,70,90,0.9)"/>
          </linearGradient>
          <linearGradient id="boltGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FFFFFF"/>
            <stop offset="40%" stop-color="#FFE066"/>
            <stop offset="100%" stop-color="#FFA500"/>
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- 🌫️ 霧 -->
    <div v-else-if="type === 'fog'" class="icon fog">
      <svg viewBox="0 0 48 48" fill="none">
        <g class="fog-lines">
          <rect x="6" y="14" width="36" height="3" rx="1.5" fill="rgba(255,255,255,0.7)"/>
          <rect x="10" y="22" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.5)"/>
          <rect x="4" y="30" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.6)"/>
          <rect x="12" y="38" width="24" height="3" rx="1.5" fill="rgba(255,255,255,0.4)"/>
        </g>
      </svg>
    </div>

    <!-- ❓ 未知 -->
    <div v-else class="icon unknown">
      <svg viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" stroke="rgba(148,163,184,0.6)" stroke-width="2" fill="rgba(148,163,184,0.1)"/>
        <text x="24" y="30" text-anchor="middle" fill="rgba(148,163,184,0.8)" font-size="16" font-weight="bold">?</text>
      </svg>
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
.weather-icon-box {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 100%;
  height: 100%;
}

.icon svg {
  width: 100%;
  height: 100%;
}

/* ☀️ 晴天動畫 */
.sunny .sun-rays {
  transform-origin: 24px 24px;
  animation: rotateSun 20s linear infinite;
}

@keyframes rotateSun {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 🌤️ 多雲時晴 - 太陽微光 */
.cloudy .sun-behind {
  animation: sunPeek 3s ease-in-out infinite;
}

@keyframes sunPeek {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* 🌧️ 雨滴動畫 */
.rainy .rain-drops line {
  animation: rainFall 1s linear infinite;
}

.rainy .rain-drops line:nth-child(1) { animation-delay: 0s; }
.rainy .rain-drops line:nth-child(2) { animation-delay: 0.33s; }
.rainy .rain-drops line:nth-child(3) { animation-delay: 0.66s; }

@keyframes rainFall {
  0% {
    transform: translateY(-4px);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateY(6px);
    opacity: 0;
  }
}

/* ⛈️ 閃電動畫 */
.thunder .lightning-bolt {
  animation: lightningFlash 2.5s ease-in-out infinite;
}

@keyframes lightningFlash {
  0%, 100% { opacity: 0; }
  85% { opacity: 0; }
  86% { opacity: 1; }
  88% { opacity: 0.2; }
  90% { opacity: 1; }
  92% { opacity: 0; }
  94% { opacity: 0.8; }
  96% { opacity: 0; }
}

/* 🌫️ 霧動畫 */
.fog .fog-lines rect {
  animation: fogDrift 4s ease-in-out infinite;
}

.fog .fog-lines rect:nth-child(1) { animation-delay: 0s; }
.fog .fog-lines rect:nth-child(2) { animation-delay: 0.5s; animation-direction: reverse; }
.fog .fog-lines rect:nth-child(3) { animation-delay: 1s; }
.fog .fog-lines rect:nth-child(4) { animation-delay: 1.5s; animation-direction: reverse; }

@keyframes fogDrift {
  0%, 100% { transform: translateX(-2px); opacity: 0.5; }
  50% { transform: translateX(2px); opacity: 0.8; }
}

/* ❓ 未知脈動 */
.unknown svg circle {
  animation: unknownPulse 2s ease-in-out infinite;
}

@keyframes unknownPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 1; }
}

/* 減少動畫 */
@media (prefers-reduced-motion: reduce) {
  .sunny .sun-rays,
  .cloudy .sun-behind,
  .rainy .rain-drops line,
  .thunder .lightning-bolt,
  .fog .fog-lines rect,
  .unknown svg circle {
    animation: none;
  }
}
</style>