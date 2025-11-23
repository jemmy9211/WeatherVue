<script>
import WeatherVisual from './WeatherVisual.vue';

export default {
    components: {
        WeatherVisual
    },
    props: ['forcastdata'],
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
    <div class="forecast-card">
        <div class="time-header">
            <h5>{{ stime }}點 ~ {{ etime }}點</h5>
        </div>
        <div class="weather-condition">
            <div class="forecast-icon-wrapper">
                <WeatherVisual :weather="Wx" />
            </div>
            <h4><strong>{{ Wx }}</strong></h4>
        </div>
        <div class="temp-section">
            <label>最高溫: {{ MaxT }}°</label>
            <div class="progress">
                <div class="progress-bar bg-danger" v-bind:style="{'width': parseInt(MaxT)*2 +'%'}"></div>
            </div>
            
            <label>最低溫: {{ MinT }}°</label>
            <div class="progress">
                <div class="progress-bar bg-success" v-bind:style="{'width': parseInt(MinT)*2 +'%'}"></div>
            </div>
        </div>
        
        <div class="pop-section">
            <h5>降雨機率 {{ PoPL }}%</h5>
            <div class="progress">
                <div class="progress-bar bg-info" v-bind:style="{'width': parseInt(PoPL) +'%'}"></div>
            </div>
        </div>
    </div>
</template>

<style>
.forecast-card {
  background: var(--neo-panel);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid var(--neo-border);
  color: var(--neo-text);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  margin-bottom: 1.5rem;
}

.forecast-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.3),
    0 4px 12px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 0 20px var(--neo-glow);
  border-color: var(--neo-accent);
}

.time-header {
  border-bottom: 1px solid var(--neo-border);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
}

.time-header h5 {
  color: var(--neo-text);
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  margin: 0;
}

.weather-condition {
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.forecast-icon-wrapper {
  display: flex;
  justify-content: center;
  transform: scale(1.2);
  margin-bottom: 0.5rem;
}

.weather-condition h4 {
  color: var(--neo-text);
  margin: 0;
  font-size: 1.2rem;
}

.weather-condition strong {
  background: linear-gradient(135deg, var(--neo-accent), #fff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.temp-section {
  margin-bottom: 1.5rem;
}

.temp-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--neo-muted);
}

.progress {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.progress-bar {
  border-radius: 10px;
  transition: width 1s ease-in-out;
}

.bg-danger {
  background: linear-gradient(90deg, #ff416c, #ff4b2b) !important;
  box-shadow: 0 0 10px rgba(255, 75, 43, 0.5);
}

.bg-success {
  background: linear-gradient(90deg, #00b09b, #96c93d) !important;
  box-shadow: 0 0 10px rgba(150, 201, 61, 0.5);
}

.bg-info {
  background: linear-gradient(90deg, var(--neo-accent), var(--neo-accent-secondary)) !important;
  box-shadow: 0 0 10px var(--neo-glow);
}

.pop-section h5 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--neo-text);
}

/* Responsive design optimization */
@media (max-width: 1200px) {
  .forecast-card {
    padding: 1.75rem;
    border-radius: 18px;
  }
  
  .time-header h5 {
    font-size: 1.05rem;
  }
  
  .weather-condition h4 {
    font-size: 1.15rem;
  }
}

@media (max-width: 992px) {
  /* Tablet styles */
  .forecast-card {
    padding: 1.5rem;
    border-radius: 18px;
    margin-bottom: 1.25rem;
  }
  
  .time-header {
    padding-bottom: 0.6rem;
    margin-bottom: 1.25rem;
  }
  
  .time-header h5 {
    font-size: 1rem;
  }
  
  .weather-condition {
    margin: 1.25rem 0;
  }
  
  .weather-condition h4 {
    font-size: 1.1rem;
  }
  
  .temp-section, .pop-section {
    margin: 1.25rem 0;
  }
  
  .progress {
    height: 0.95rem;
    margin-bottom: 0.875rem;
  }
  
  label {
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  /* Mobile layout-only adjustments */
  .forecast-card {
    padding: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .time-header {
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }
}

@media (max-width: 576px) {
  /* Small mobile styles */
  .forecast-card {
    padding: 1rem;
    border-radius: 14px;
    margin-bottom: 0.875rem;
  }
  
  .time-header {
    padding-bottom: 0.4rem;
    margin-bottom: 0.875rem;
  }
  
  .time-header h5 {
    font-size: 0.9rem;
  }
  
  .weather-condition {
    margin: 0.875rem 0;
  }
  
  .weather-condition h4 {
    font-size: 1rem;
  }
  
  .temp-section, .pop-section {
    margin: 0.875rem 0;
  }
  
  .temp-section h5, .pop-section h5 {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .progress {
    height: 0.75rem;
    margin-bottom: 0.625rem;
    border-radius: 6px;
  }
  
  .progress-bar {
    border-radius: 6px;
  }
  
  label {
    font-size: 0.85rem;
    margin-bottom: 0.35rem;
  }
}

@media (max-width: 420px) {
  /* Extra small mobile styles */
  .forecast-card {
    padding: 0.875rem;
    border-radius: 12px;
  }
  
  .time-header h5 {
    font-size: 0.85rem;
  }
  
  .weather-condition h4 {
    font-size: 0.95rem;
  }
  
  .temp-section h5, .pop-section h5 {
    font-size: 0.85rem;
  }
  
  label {
    font-size: 0.8rem;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .forecast-card {
    -webkit-tap-highlight-color: rgba(0, 122, 255, 0.1);
  }
}
</style>
