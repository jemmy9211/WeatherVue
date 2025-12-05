<script>
import WeatherVisual from './WeatherVisual.vue';

export default {
    components: {
        WeatherVisual
    },
    props: ['forcastdata', 'index'],
    data(){
        return{
            data: [],
            stime: [],
            etime: [],
            MaxT: [],
            MinT: [],
            PoPL: [],
            Wx: []
        }
    },
    computed: {
        periodLabel() {
            const labels = ['現在', '第二時段', '第三時段'];
            return labels[this.index] || '';
        },
        isHighRain() {
            return parseInt(this.PoPL) >= 60;
        }
    },
    created(){
        this.data = this.forcastdata.split(',');
        this.Wx = this.data[5]
        this.MaxT = this.data[4]
        this.MinT = this.data[3]
        this.PoPL = this.data[2]
        this.etime = this.data[1][11] + this.data[1][12]
        this.stime = this.data[0][11] + this.data[0][12]
    }
}
</script>

<template>
    <article class="forecast-card">
        <!-- 時間標題 -->
        <header class="card-header">
            <span class="period-label" v-if="periodLabel">{{ periodLabel }}</span>
            <span class="time-range">{{ stime }}:00 - {{ etime }}:00</span>
        </header>
        
        <!-- 主要內容：三欄式 -->
        <div class="card-body">
            <!-- 左側：天氣圖示 -->
            <div class="weather-visual">
                <WeatherVisual :weather="Wx" class="icon" />
                <span class="wx-text">{{ Wx }}</span>
            </div>
            
            <!-- 中間：溫度 -->
            <div class="temp-display">
                <div class="temp-main">
                    <span class="temp-high">{{ MaxT }}°</span>
                    <span class="temp-sep">/</span>
                    <span class="temp-low">{{ MinT }}°</span>
                </div>
                <span class="temp-label">高溫 / 低溫</span>
            </div>
            
            <!-- 右側：降雨機率 -->
            <div class="rain-prob">
                <div class="rain-value" :class="{ 'high-rain': isHighRain }">
                    <i class="bi bi-droplet-fill"></i>
                    <span>{{ PoPL }}%</span>
                </div>
                <span class="rain-label">降雨機率</span>
            </div>
        </div>
    </article>
</template>

<style scoped>
.forecast-card {
  background: var(--neo-panel);
  border: 1px solid var(--neo-border);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.2s ease;
  box-shadow: var(--neo-shadow);
}

.forecast-card:hover {
  border-color: var(--neo-accent);
  box-shadow: var(--neo-shadow-lg);
}

/* 卡片標題 */
.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.85rem;
  background: var(--neo-surface);
  border-bottom: 1px solid var(--neo-border);
}

.period-label {
  background: var(--neo-accent);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  text-transform: uppercase;
}

.time-range {
  color: var(--neo-muted);
  font-size: 0.75rem;
  font-weight: 500;
}

/* 主體內容 - 三欄式 */
.card-body {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0.85rem;
  gap: 0.75rem;
}

/* 天氣圖示區 */
.weather-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.weather-visual .icon {
  width: 48px;
  height: 48px;
}

.wx-text {
  font-size: 0.65rem;
  color: var(--neo-muted);
  text-align: center;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 溫度顯示區 */
.temp-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0 0.75rem;
  border-left: 1px solid var(--neo-border);
  border-right: 1px solid var(--neo-border);
}

.temp-main {
  display: flex;
  align-items: baseline;
  gap: 0.15rem;
}

.temp-high {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ef4444;
}

.temp-sep {
  font-size: 1rem;
  color: var(--neo-muted);
  margin: 0 0.1rem;
}

.temp-low {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neo-accent);
}

.temp-label {
  font-size: 0.6rem;
  color: var(--neo-muted);
}

/* 降雨機率區 */
.rain-prob {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.rain-value {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--neo-text);
}

.rain-value i {
  font-size: 0.9rem;
  color: #3b82f6;
}

.rain-value.high-rain {
  color: #3b82f6;
}

.rain-value.high-rain i {
  color: #2563eb;
}

.rain-label {
  font-size: 0.6rem;
  color: var(--neo-muted);
}

/* 響應式 - 平板 */
@media (max-width: 992px) {
  .card-body {
    padding: 0.75rem;
    gap: 0.6rem;
  }
  
  .weather-visual .icon {
    width: 42px;
    height: 42px;
  }
  
  .temp-high {
    font-size: 1.35rem;
  }
  
  .temp-low {
    font-size: 1.15rem;
  }
  
  .rain-value {
    font-size: 1rem;
  }
}

/* 響應式 - 手機 */
@media (max-width: 768px) {
  .forecast-card {
    border-radius: 12px;
  }
  
  .card-header {
    padding: 0.5rem 0.75rem;
  }
  
  .period-label {
    font-size: 0.6rem;
    padding: 0.15rem 0.4rem;
  }
  
  .time-range {
    font-size: 0.7rem;
  }
  
  .card-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.65rem 0.75rem;
    gap: 0.5rem;
  }
  
  .weather-visual {
    flex-direction: row;
    align-items: center;
    gap: 0.4rem;
    flex-shrink: 0;
  }
  
  .weather-visual .icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }
  
  .wx-text {
    font-size: 0.65rem;
    max-width: 50px;
  }
  
  .temp-display {
    flex-direction: row;
    align-items: center;
    gap: 0.25rem;
    padding: 0 0.5rem;
    flex: 1;
    justify-content: center;
    min-width: 0;
  }
  
  .temp-main {
    gap: 0.1rem;
  }
  
  .temp-high {
    font-size: 1.15rem;
  }
  
  .temp-low {
    font-size: 0.95rem;
  }
  
  .temp-label {
    display: none;
  }
  
  .rain-prob {
    flex-direction: row;
    align-items: center;
    gap: 0.2rem;
    flex-shrink: 0;
  }
  
  .rain-value {
    font-size: 0.9rem;
    gap: 0.15rem;
  }
  
  .rain-value i {
    font-size: 0.75rem;
  }
  
  .rain-label {
    display: none;
  }
}

/* 響應式 - 小螢幕手機 */
@media (max-width: 576px) {
  .card-header {
    padding: 0.4rem 0.6rem;
  }
  
  .period-label {
    font-size: 0.55rem;
    padding: 0.12rem 0.35rem;
  }
  
  .time-range {
    font-size: 0.65rem;
  }
  
  .card-body {
    padding: 0.5rem 0.6rem;
    gap: 0.4rem;
  }
  
  .weather-visual .icon {
    width: 28px;
    height: 28px;
  }
  
  .wx-text {
    font-size: 0.6rem;
    max-width: 40px;
  }
  
  .temp-display {
    padding: 0 0.35rem;
    border-left: none;
    border-right: none;
  }
  
  .temp-high {
    font-size: 1rem;
  }
  
  .temp-sep {
    font-size: 0.85rem;
  }
  
  .temp-low {
    font-size: 0.85rem;
  }
  
  .rain-value {
    font-size: 0.8rem;
  }
  
  .rain-value i {
    font-size: 0.7rem;
  }
}
</style>
