<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import axios from 'axios'
import NavBar from './NavBar.vue';

const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-FAC637E3-79B2-4800-B15D-9E19F7BB350B';

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
  </div>
</template>

<style>
/* Remove the duplicate navbar styles since they are now in the NavBar component */
.main-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

.location-header {
  background-color: rgba(33, 37, 41, 0.75);
  color: white;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.forecast-container {
  height: 800px;
  overflow: auto;
  padding: 1rem;
  border-radius: 10px;
  background-color: rgba(248, 249, 250, 0.1);
}

.forecast-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.map-container {
  grid-column: 1 / -1;
  margin-top: 2rem;
}

.map-title {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1rem;
  border-radius: 10px 10px 0 0;
  margin-bottom: 0;
}

.map-wrapper {
  height: 400px;
  width: 100%;
  border-radius: 0 0 10px 10px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .nav-links {
    flex-wrap: wrap;
  }
  
  .nav-btn {
    flex: 1 0 calc(50% - 0.5rem);
    text-align: center;
  }
  
  .forecast-row {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}
</style>
