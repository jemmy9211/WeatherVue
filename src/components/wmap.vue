<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LControlZoom, LIcon, LPopup, LControl, LCircleMarker } from "@vue-leaflet/vue-leaflet";
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
    LCircleMarker,
    NavBar
  },
  props:[],
  data(){
    return {
      data: null,
      zoom: 8,
      showdiv: false,
      showmap: false,
      currentlocationx: '',
      currentlocationy: '',
      circleRadius: 8,
      winheight: 0,
      selectedCounty: '',
      search: '',
      isDarkMap: false
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
  computed: {
    filteredData() {
      if (!this.data) return [];
      
      let result = this.data;
      
      // 縣市篩選
      if (this.selectedCounty) {
        result = result.filter(item => item.GeoInfo.CountyName === this.selectedCounty);
      }
      
      // 關鍵字搜尋
      if (this.search) {
        const searchkey = this.search.replace('台', '臺');
        var aset = result.filter(item => item.GeoInfo.CountyName.includes(searchkey));
        var bset = result.filter(item => item.StationName.includes(searchkey));
        result = aset.concat(bset.filter((e) => { return aset.indexOf(e) === -1; }));
      }
      
      return result;
    },
    tileUrl() {
      // 使用同一個地圖，透過 CSS filter 調整明暗
      return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    },
    tileAttribution() {
      return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    },
    mapClass() {
      return this.isDarkMap ? 'dark-map-mode' : '';
    }
  },
  methods: {
    getMarkerColor(station) {
      const temp = parseFloat(station.WeatherElement?.AirTemperature);
      
      // 無效溫度顯示灰色
      if (isNaN(temp) || temp === -99) {
        return '#9ca3af';
      }
      
      // 根據溫度範圍返回顏色
      if (temp <= 10) return '#3b82f6';      // 冷 - 藍色
      if (temp <= 15) return '#06b6d4';      // 涼 - 青色
      if (temp <= 20) return '#22c55e';      // 舒適 - 綠色
      if (temp <= 25) return '#84cc16';      // 溫暖 - 黃綠色
      if (temp <= 30) return '#f97316';      // 熱 - 橙色
      return '#ef4444';                       // 很熱 - 紅色
    },
    clearFilters() {
      this.selectedCounty = '';
      this.search = '';
    },
    toggleMapMode() {
      this.isDarkMap = !this.isDarkMap;
    }
  }
};
</script>
<template>
  <div class="weather-map-container">
    <div class="map-header">
      <NavBar 
        :showFilter="true"
        v-model:selectedCounty="selectedCounty"
        v-model:search="search"
        @clear="clearFilters"
      />
    </div>
    
    <div class="map-info-bar">
      <div class="info-left">
        <i class="bi bi-pin-map-fill"></i>
        <span>顯示 {{ filteredData.length }} 個觀測站</span>
      </div>
      <div class="info-center">
        <button class="map-mode-toggle" @click="toggleMapMode" :title="isDarkMap ? '切換一般模式' : '切換黑暗模式'">
          <i :class="isDarkMap ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
          <span>{{ isDarkMap ? '一般模式' : '黑暗模式' }}</span>
        </button>
      </div>
      <div class="info-right">
        <i class="bi bi-hand-index-thumb"></i>
        <span>點按標記查看詳情</span>
      </div>
    </div>
    
    <div class="map-content">
      <div v-if="showdiv" id="map" ref="myDiv" :style="{ height: winheight - 180 + 'px' }" :class="mapClass">
        <l-map ref="map" v-model:zoom="zoom" :center="[23.45889,120.9417]" :useGlobalLeaflet="false">
          <l-tile-layer
            :url="tileUrl"
            :attribution="tileAttribution"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          
          <l-circle-marker 
            v-for="(x, index) in filteredData" 
            :key="index"
            :lat-lng="[x.GeoInfo.Coordinates[0].StationLatitude, x.GeoInfo.Coordinates[0].StationLongitude]"
            :radius="circleRadius"
            :color="getMarkerColor(x)"
            :fill-color="getMarkerColor(x)"
            :fill-opacity="0.8"
            :weight="2"
          >
            <l-popup>
              <weather-block 
                class="map-popup-weather-block" 
                v-bind:city="x" 
                :citynum="index" 
                :inPopup="true"
              />
            </l-popup>
          </l-circle-marker>
        </l-map>
        
        <!-- 溫度圖例 -->
        <div class="temp-legend">
          <div class="legend-title">
            <i class="bi bi-thermometer-half"></i>
            溫度圖例
          </div>
          <div class="legend-items">
            <div class="legend-item">
              <span class="legend-dot" style="background: #ef4444;"></span>
              <span class="legend-label">&gt; 30°C 很熱</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #f97316;"></span>
              <span class="legend-label">26-30°C 熱</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #84cc16;"></span>
              <span class="legend-label">21-25°C 溫暖</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #22c55e;"></span>
              <span class="legend-label">16-20°C 舒適</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #06b6d4;"></span>
              <span class="legend-label">11-15°C 涼</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #3b82f6;"></span>
              <span class="legend-label">≤ 10°C 冷</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #9ca3af;"></span>
              <span class="legend-label">無資料</span>
            </div>
          </div>
        </div>
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

/* 資訊列 */
.map-info-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem 0.5rem;
  background: var(--neo-panel);
  border: 1px solid var(--neo-border);
  border-radius: 10px;
  font-size: 0.8rem;
  box-shadow: var(--neo-shadow);
}

.info-left, .info-right {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--neo-muted);
}

.info-left i {
  color: var(--neo-accent);
}

.info-center {
  display: flex;
  align-items: center;
}

.map-mode-toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  background: var(--neo-bg);
  border: 1px solid var(--neo-border);
  border-radius: 20px;
  color: var(--neo-text);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.map-mode-toggle:hover {
  background: var(--neo-accent);
  color: white;
  border-color: var(--neo-accent);
  transform: scale(1.02);
}

.map-mode-toggle i {
  font-size: 0.85rem;
}

.map-mode-toggle .bi-moon-fill {
  color: #6366f1;
}

.map-mode-toggle .bi-sun-fill {
  color: #f59e0b;
}

.map-mode-toggle:hover i {
  color: white;
}

.info-right i {
  color: #f59e0b;
}

.map-content {
  flex-grow: 1;
  position: relative;
  padding: 0 0.5rem 0.5rem;
}

#map {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--neo-shadow-lg);
  border: 1px solid var(--neo-border);
  position: relative;
}

/* 溫度圖例樣式 */
.temp-legend {
  position: absolute;
  bottom: 30px;
  right: 10px;
  background: var(--neo-panel, rgba(255, 255, 255, 0.95));
  border: 1px solid var(--neo-border, #e0e0e0);
  border-radius: 8px;
  padding: 10px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  font-size: 0.75rem;
  backdrop-filter: blur(8px);
}

.legend-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  color: var(--neo-text, #333);
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--neo-border, #e0e0e0);
}

.legend-title i {
  color: var(--neo-accent, #6366f1);
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1.5px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.legend-label {
  color: var(--neo-text, #555);
  white-space: nowrap;
}

/* Dark map mode - 反轉色彩深色效果（保留中文標籤） */
.dark-map-mode .leaflet-tile-pane {
  filter: invert(100%) hue-rotate(180deg) brightness(0.95) contrast(0.9);
}

.dark-map-mode .leaflet-control-zoom a {
  background-color: rgba(40, 40, 50, 0.9);
  color: #e0e0e0;
  border-color: rgba(80, 80, 90, 0.8);
}

.dark-map-mode .leaflet-control-zoom a:hover {
  background-color: rgba(60, 60, 70, 0.95);
}

.dark-map-mode .leaflet-control-attribution {
  background-color: rgba(30, 30, 40, 0.8);
  color: #aaa;
}

.dark-map-mode .leaflet-control-attribution a {
  color: #8ab4f8;
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
  box-shadow: var(--neo-shadow-lg);
  background: var(--neo-panel);
  border: 1px solid var(--neo-border);
  color: var(--neo-text);
}

.leaflet-popup-tip {
  background: var(--neo-panel);
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
}

.loading-container h5 {
  margin-top: 15px;
  line-height: 1.5;
  color: var(--neo-text);
}

.spinner-border {
  color: var(--neo-accent) !important;
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
  
  .map-info-bar {
    padding: 0.4rem 0.75rem;
    margin: 0 0.4rem 0.4rem;
    font-size: 0.75rem;
    border-radius: 8px;
  }
  
  .map-mode-toggle {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
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
  .map-info-bar {
    padding: 0.35rem 0.6rem;
    margin: 0 0.35rem 0.35rem;
    font-size: 0.7rem;
    gap: 0.5rem;
  }
  
  .info-right {
    display: none;
  }
  
  .map-mode-toggle {
    padding: 0.3rem 0.5rem;
    font-size: 0.65rem;
  }
  
  .map-mode-toggle span {
    display: none;
  }
  
  .map-mode-toggle i {
    font-size: 0.9rem;
  }
  
  .map-content {
    padding: 0 0.35rem 0.35rem;
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
  .map-info-bar {
    font-size: 0.65rem;
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
