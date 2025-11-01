<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import axios from 'axios'
import NavBar from './NavBar.vue';
const apiKey = import.meta.env.VITE_CWA_KEY;
const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${apiKey}`;

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    NavBar
  },
  props: ['nowdata'],
  data() {
    return {
      zoom: 11,
      lat: '',
      lon: '',
      sname: '',
      wdata: [],
      MaxT: [],
      MinT: [],
      PoPL: [],
      Wx: [],
      totaldata: []
    };
  },
  created(){
    this.lat=this.$route.query.lat;
    this.lon=this.$route.query.lon;
    this.sname=this.$route.query.sname;
    axios.get(url).then((res)=>{
      //console.log(res.data)
      var tep=this.$route.query.userId;
      tep=2
      //console.log(this.$route.query.userId)
      for(var i=0;i<res.data.records.location.length;i++){
        if(this.$route.query.userId==res.data.records.location[i].locationName){
          tep=i;
          //console.log(i)
        }
      }
      this.wdata=res.data.records.location[tep]
      this.MaxT=res.data.records.location[tep].weatherElement[4].time
      this.MinT=res.data.records.location[tep].weatherElement[2].time
      this.PoPL=res.data.records.location[tep].weatherElement[1].time
      this.Wx=res.data.records.location[tep].weatherElement[0].time
      for(var i=0;i<3;i++){
        this.totaldata[i]=this.Wx[i].startTime+","+this.Wx[i].endTime+","+this.PoPL[i].parameter.parameterName+","+this.MinT[i].parameter.parameterName+","+this.MaxT[i].parameter.parameterName+","+this.Wx[i].parameter.parameterName
      }
    }).catch((error) => {
      console.error("An error occurred:", error)
    })
  }
};
</script>

<template>
  <!-- Navigation bar -->
  <NavBar />
  
  <!-- Main content -->
  <div class="main-container">
    <!-- Header -->
    <div class="location-header">
      <h3>{{ wdata.locationName }} 未來36小時預報</h3>
    </div>
    
    <!-- Forecast content -->
    <div class="forecast-container">
      <div class="forecast-row">    
        <forcastcom v-for="x in totaldata" v-bind:forcastdata="x"></forcastcom>
      </div>
      
      <!-- Map section -->
      <div class="map-container">
        <h3 class="map-title">{{sname}} 觀測站位置圖</h3>
        <div class="map-wrapper" ref="myDiv">
          <l-map ref="map" v-model:zoom="zoom" :center="[lat, lon]" :useGlobalLeaflet="false">
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
            ></l-tile-layer>
            <l-marker :lat-lng="[lat, lon]"></l-marker>
          </l-map>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.main-container {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
}

.location-header {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.location-header:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.location-header h3 {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 1) 0%,
    rgba(52, 199, 89, 1) 50%,
    rgba(255, 149, 0, 1) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.forecast-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
  overflow: auto;
  padding: 1.5rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.06),
    0 1px 4px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.forecast-row {
  width: 90%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.map-container {
  width: 90%;
  margin-top: 2rem;
}

.map-title {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-bottom: none;
  color: #000000;
  padding: 1.5rem;
  border-radius: 20px 20px 0 0;
  margin-bottom: 0;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 1px 4px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.map-wrapper {
  height: 400px;
  width: 100%;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-top: none;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
}

/* Custom scrollbar for forecast container */
.forecast-container::-webkit-scrollbar {
  width: 8px;
}

.forecast-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.forecast-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 0.6) 0%, 
    rgba(52, 199, 89, 0.6) 100%
  );
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.forecast-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 0.8) 0%, 
    rgba(52, 199, 89, 0.8) 100%
  );
  background-clip: content-box;
}

/* Responsive design optimization */
@media (max-width: 1200px) {
  .main-container {
    max-width: 95%;
    padding: 0.75rem;
  }
  
  .forecast-row {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 992px) {
  /* Tablet styles */
  .main-container {
    margin: 1.5rem auto;
    padding: 0.5rem;
  }
  
  .location-header {
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    border-radius: 18px;
  }
  
  .location-header h3 {
    font-size: 1.5rem;
  }
  
  .forecast-container {
    padding: 1.25rem;
    border-radius: 18px;
  }
  
  .forecast-row {
    width: 95%;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }
  
  .map-container {
    width: 95%;
    margin-top: 1.5rem;
  }
  
  .map-title {
    padding: 1.25rem;
    font-size: 1.1rem;
    border-radius: 18px 18px 0 0;
  }
  
  .map-wrapper {
    height: 350px;
    border-radius: 0 0 18px 18px;
  }
}

@media (max-width: 768px) {
  /* Mobile layout-only adjustments */
  .main-container {
    margin: 1rem 0.5rem;
    padding: 0.5rem;
  }
  
  .location-header {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .forecast-container {
    padding: 1rem;
    min-height: 60vh;
  }
  
  .forecast-row {
    width: 100%;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .map-container {
    width: 100%;
    margin-top: 1rem;
  }
  
  .map-title {
    padding: 1rem;
  }
  
  .map-wrapper {
    height: 300px;
  }
}

@media (max-width: 576px) {
  /* Small mobile styles */
  .main-container {
    margin: 0.75rem 0.25rem;
    padding: 0.25rem;
  }
  
  .location-header {
    padding: 0.875rem;
    border-radius: 14px;
  }
  
  .location-header h3 {
    font-size: 1.1rem;
  }
  
  .forecast-container {
    padding: 0.75rem;
    border-radius: 14px;
  }
  
  .forecast-row {
    gap: 0.875rem;
  }
  
  .map-title {
    padding: 0.875rem;
    font-size: 0.95rem;
    border-radius: 14px 14px 0 0;
  }
  
  .map-wrapper {
    height: 250px;
    border-radius: 0 0 14px 14px;
  }
}

/* Touch-friendly improvements for mobile */
@media (hover: none) and (pointer: coarse) {
  /* Increase touch target sizes on touch devices */
  .forecast-container {
    -webkit-overflow-scrolling: touch;
  }
}
</style>
