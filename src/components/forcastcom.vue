<script>
export default {
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
            <h4><wicon v-bind:wvalue="Wx"></wicon> <strong>{{ Wx }}</strong></h4>
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
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(40, 40, 40, 0.9);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  margin-bottom: 1.5rem;
}

.forecast-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.time-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
}

.time-header h5 {
  color: rgba(40, 40, 40, 0.9);
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
  margin: 0;
}

.weather-condition {
  margin: 1.5rem 0;
  text-align: center;
}

.weather-condition h4 {
  color: rgba(40, 40, 40, 0.9);
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

.temp-section, .pop-section {
  margin: 1.5rem 0;
}

.temp-section h5, .pop-section h5 {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 1) 0%,
    rgba(52, 199, 89, 1) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.progress {
  height: 1rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
  overflow: hidden;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(255, 255, 255, 0.1);
}

.progress-bar {
  transition: width 1s ease-in-out;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress-bar.bg-danger {
  background: linear-gradient(135deg, 
    rgba(255, 59, 48, 0.9) 0%, 
    rgba(255, 149, 0, 0.9) 100%
  );
  box-shadow: 
    0 2px 8px rgba(255, 59, 48, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.progress-bar.bg-success {
  background: linear-gradient(135deg, 
    rgba(52, 199, 89, 0.9) 0%, 
    rgba(48, 209, 88, 0.9) 100%
  );
  box-shadow: 
    0 2px 8px rgba(52, 199, 89, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.progress-bar.bg-info {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 0.9) 0%, 
    rgba(52, 120, 246, 0.9) 100%
  );
  box-shadow: 
    0 2px 8px rgba(0, 122, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

label {
  margin-bottom: 0.5rem;
  display: block;
  color: rgba(40, 40, 40, 0.9);
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}
</style>
