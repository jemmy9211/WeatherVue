<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LControlZoom, LIcon, LPopup, LControl } from "@vue-leaflet/vue-leaflet";
import ico from "../assets/location-pin.png"
import axios from 'axios'
import NavBar from './NavBar.vue';
const apiKey = 'CWA-FAC637E3-79B2-4800-B15D-9E19F7BB350B';
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

.map-alert .alert {
  background: rgba(220, 53, 69, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  border-radius: 14px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.5);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  font-weight: 700;
}

.map-content {
  flex-grow: 1;
  position: relative;
}

#map {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--neo-border);
}

/* Dark mode map filter */
.leaflet-layer,
.leaflet-control-zoom-in,
.leaflet-control-zoom-out,
.leaflet-control-attribution {
  filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
}

/* Marker color classes */
.marker-blue img {
  filter: hue-rotate(0deg) drop-shadow(0 0 5px rgba(0, 122, 255, 0.5));
}

.marker-red img {
  filter: hue-rotate(140deg) drop-shadow(0 0 5px rgba(255, 59, 48, 0.5));
}

.marker-green img {
  filter: hue-rotate(280deg) drop-shadow(0 0 5px rgba(52, 199, 89, 0.5));
}

.marker-yellow img {
  filter: hue-rotate(40deg) drop-shadow(0 0 5px rgba(255, 204, 0, 0.5));
}

.marker-purple img {
  filter: hue-rotate(220deg) drop-shadow(0 0 5px rgba(175, 82, 222, 0.5));
}

.marker-orange img {
  filter: hue-rotate(80deg) drop-shadow(0 0 5px rgba(255, 149, 0, 0.5));
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
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid var(--neo-border);
  color: var(--neo-text);
}

.leaflet-popup-tip {
  background: rgba(15, 23, 42, 0.9);
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
  color: var(--neo-text);
  text-align: center;
  background-color: var(--neo-panel);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid var(--neo-border);
  backdrop-filter: blur(12px);
}

.loading-container h5 {
  margin-top: 15px;
  line-height: 1.5;
  color: var(--neo-text);
  text-shadow: 0 0 10px var(--neo-glow);
}

.spinner-border {
  color: var(--neo-accent);
  box-shadow: 0 0 15px var(--neo-glow);
  border-radius: 50%;
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
