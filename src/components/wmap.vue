<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LControlZoom, LIcon, LPopup, LControl } from "@vue-leaflet/vue-leaflet";
import ico from "../assets/location-pin.png"
import axios from 'axios'
import NavBar from './NavBar.vue';
const apiKey = import.meta.env.VITE_CWA_KEY;
const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${apiKey}`;
export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControlZoom,
    LIcon,
    LPopup,
    LControl,
    NavBar
  },
  props:[],
  data(){
    return {
      data: null,
      zoom: 8,
      iconUrl: ico,
      showdiv: false,
      showmap: false,
      currentlocationx: '',
      currentlocationy: '',
      iconSize: 32,
      winheight: 0,
      markerColors: ['blue', 'red', 'green', 'orange', 'yellow', 'purple']
    }
  },
  created(){
    this.winheight = window.innerHeight
    axios.get(url)
    .then((res) => {
      this.data = res.data.records.Station
      this.showdiv = true
    })
    .catch((error) => {
      console.error("An error occurred:", error)
      this.showdiv = false
    })
  },
  methods: {
    getMarkerColor(station, index) {
      return this.markerColors[index % this.markerColors.length];
    }
  }
};
</script>
<template>
  <div class="weather-map-container">
    <div class="map-header">
      <NavBar />
    </div>
    
    <div class="map-alert">
      <div class="alert alert-success">
        <strong>全台觀測站位置圖!</strong> 點按marker取得觀測站資料!
      </div>
    </div>
    
    <div class="map-content">
      <div v-if="showdiv" id="map" ref="myDiv" :style="{ height: winheight - 230 + 'px' }">
        <l-map ref="map" v-model:zoom="zoom" :center="[23.45889,120.9417]" :useGlobalLeaflet="false">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          
          <l-marker 
            v-for="(x, index) in data" 
            :key="index"
            :lat-lng="[x.GeoInfo.Coordinates[0].StationLatitude, x.GeoInfo.Coordinates[0].StationLongitude]"
          >
            <l-icon
              :icon-url="iconUrl"
              :icon-size="[iconSize, iconSize]"
              :icon-anchor="[iconSize/2, iconSize]"
              :class-name="'marker-' + getMarkerColor(x, index)"
            ></l-icon>
            <l-popup>
              <weather-block 
                class="map-popup-weather-block" 
                v-bind:city="x" 
                :citynum="index" 
                :inPopup="true"
              />
            </l-popup>
          </l-marker>
        </l-map>
      </div>
      
      <div v-else class="loading-container">
        <div class="spinner-border text-light"></div>
        <h5>中央氣象局API正在更新資料<br>
        請稍後再重新整理頁面<br>
        謝謝!</h5>
      </div>
    </div>
  </div>
</template>

<style>
/* Map container styles */
.weather-map-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.map-header {
  width: 100%;
}

.map-alert {
  padding: 0 15px;
  margin-bottom: 10px;
}

.map-content {
  flex-grow: 1;
  position: relative;
}

#map {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Marker color classes */
.marker-blue img {
  filter: hue-rotate(0deg);
}

.marker-red img {
  filter: hue-rotate(140deg);
}

.marker-green img {
  filter: hue-rotate(280deg);
}

.marker-yellow img {
  filter: hue-rotate(40deg);
}

.marker-purple img {
  filter: hue-rotate(220deg);
}

.marker-orange img {
  filter: hue-rotate(80deg);
}

/* Popup styling */
.leaflet-popup-content {
  width: auto !important;
  min-width: 280px;
  margin: 5px !important;
  padding: 0 !important;
  overflow: hidden;
}

.leaflet-popup-content-wrapper {
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 3px 14px rgba(0,0,0,0.2);
}

.map-popup-weather-block {
  width: 100%;
  max-width: 300px;
}

/* Loading container */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: white;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 20px;
}

.loading-container h5 {
  margin-top: 15px;
  line-height: 1.5;
}

/* Responsive design optimization */
@media (max-width: 1200px) {
  .weather-map-container {
    height: 100vh;
  }
  
  #map {
    border-radius: 6px;
  }
}

@media (max-width: 992px) {
  /* Tablet styles */
  .map-alert {
    padding: 0 12px;
    margin-bottom: 8px;
  }
  
  .map-alert .alert {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  #map {
    border-radius: 6px;
  }
  
  .leaflet-popup-content {
    min-width: 260px;
  }
  
  .map-popup-weather-block {
    max-width: 280px;
  }
}

@media (max-width: 768px) {
  /* Mobile styles */
  .weather-map-container {
    height: 100vh;
  }
  
  .map-alert {
    padding: 0 8px;
    margin-bottom: 8px;
  }
  
  .map-alert .alert {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 12px;
  }
  
  .map-alert strong {
    font-size: 0.95rem;
  }
  
  #map {
    border-radius: 0;
    box-shadow: none;
  }
  
  .leaflet-popup-content {
    min-width: 240px;
    max-width: 280px;
  }
  
  .leaflet-popup-content-wrapper {
    border-radius: 12px;
  }
  
  .map-popup-weather-block {
    max-width: 260px;
  }
  
  /* Adjust Leaflet controls for mobile */
  .leaflet-control-zoom {
    margin-top: 10px !important;
    margin-right: 10px !important;
  }
  
  .leaflet-control-zoom a {
    width: 36px !important;
    height: 36px !important;
    line-height: 36px !important;
    font-size: 20px !important;
  }
}

@media (max-width: 576px) {
  /* Small mobile styles */
  .map-alert {
    padding: 0 6px;
    margin-bottom: 6px;
  }
  
  .map-alert .alert {
    padding: 0.625rem;
    font-size: 0.85rem;
    border-radius: 10px;
  }
  
  .map-alert strong {
    font-size: 0.875rem;
    display: block;
    margin-bottom: 0.25rem;
  }
  
  .leaflet-popup-content {
    min-width: 200px;
    max-width: calc(100vw - 60px);
  }
  
  .map-popup-weather-block {
    max-width: 100%;
  }
  
  /* Smaller icon size on small mobile */
  .leaflet-marker-icon {
    width: 28px !important;
    height: 28px !important;
  }
  
  .leaflet-control-zoom {
    margin-top: 8px !important;
    margin-right: 8px !important;
  }
  
  .leaflet-control-zoom a {
    width: 32px !important;
    height: 32px !important;
    line-height: 32px !important;
    font-size: 18px !important;
  }
}

@media (max-width: 420px) {
  /* Extra small mobile styles */
  .map-alert .alert {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  
  .leaflet-popup-content {
    min-width: 180px;
  }
  
  .leaflet-marker-icon {
    width: 24px !important;
    height: 24px !important;
  }
}

/* Landscape orientation adjustments */
@media (max-width: 992px) and (orientation: landscape) {
  .weather-map-container {
    height: 100vh;
  }
  
  .map-alert {
    margin-bottom: 4px;
  }
  
  .map-alert .alert {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
  
  .leaflet-control-zoom {
    margin-top: 6px !important;
    margin-right: 6px !important;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .leaflet-popup-close-button {
    width: 32px !important;
    height: 32px !important;
    font-size: 24px !important;
    padding: 4px !important;
  }
  
  .leaflet-control-zoom a {
    min-width: 44px; /* Minimum touch target size */
    min-height: 44px;
  }
}
</style>
