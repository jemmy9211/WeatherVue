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
    background-color: rgba(33, 37, 41, 0.85);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, box-shadow 0.3s;
    margin-bottom: 1.5rem;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.forecast-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
}

.time-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
}

.weather-condition {
    margin: 1rem 0;
    text-align: center;
}

.temp-section, .pop-section {
    margin: 1rem 0;
}

.progress {
    height: 0.8rem;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.2);
    margin-bottom: 1rem;
    overflow: hidden;
}

.progress-bar {
    transition: width 1s ease-in-out;
    border-radius: 5px;
}

label {
    margin-bottom: 0.4rem;
    display: block;
}
</style>
