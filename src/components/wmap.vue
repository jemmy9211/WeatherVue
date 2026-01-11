<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LControlZoom, LIcon, LPopup, LControl, LCircleMarker } from "@vue-leaflet/vue-leaflet";
import axios from 'axios'
import NavBar from './NavBar.vue';
import WeatherBlock from './weatherblock.vue';
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
    NavBar,
    WeatherBlock
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
    },
    getAverageTemp() {
      if (!this.filteredData || this.filteredData.length === 0) return '--';
      
      const validTemps = this.filteredData
        .map(s => parseFloat(s.WeatherElement?.AirTemperature))
        .filter(t => !isNaN(t) && t !== -99);
      
      if (validTemps.length === 0) return '--';
      
      const avg = validTemps.reduce((a, b) => a + b, 0) / validTemps.length;
      return avg.toFixed(1);
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
    
    <div class="map-content">
      <div v-if="showdiv" id="map" ref="myDiv" :style="{ height: winheight - 100 + 'px' }" :class="mapClass">
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
        
        <!-- Hero Section - 浮動在地圖上方 -->
        <div class="hero-section">
          <div class="hero-content">
            <div class="hero-text">
              <h1 class="hero-title">
                <i class="bi bi-cloud-sun-fill"></i>
                台灣即時天氣地圖
              </h1>
              <p class="hero-subtitle">
                全台 {{ filteredData.length }} 個氣象觀測站即時資料
              </p>
            </div>
            <div class="hero-actions">
              <router-link to="/locations" class="hero-btn primary">
                <i class="bi bi-list-ul"></i>
                <span>全部地點</span>
              </router-link>
              <router-link to="/rader" class="hero-btn secondary">
                <i class="bi bi-radar"></i>
                <span>雷達圖</span>
              </router-link>
            </div>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <i class="bi bi-pin-map-fill"></i>
              <span class="stat-value">{{ filteredData.length }}</span>
              <span class="stat-label">觀測站</span>
            </div>
            <div class="stat-item">
              <i class="bi bi-thermometer-half"></i>
              <span class="stat-value">{{ getAverageTemp() }}°</span>
              <span class="stat-label">平均溫度</span>
            </div>
            <div class="stat-item">
              <button class="map-mode-btn" @click="toggleMapMode" :title="isDarkMap ? '切換一般模式' : '切換黑暗模式'">
                <i :class="isDarkMap ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
              </button>
              <span class="stat-label">{{ isDarkMap ? '淺色' : '深色' }}</span>
            </div>
          </div>
        </div>
        
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
  position: relative;
}

.map-header {
  width: 100%;
  position: relative;
  z-index: 1001;
}

/* Hero Section - 浮動在地圖上方 */
.hero-section {
  position: absolute;
  top: 12px;
  left: 12px;
  right: auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  color: #1e293b;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  max-width: 300px;
}

.hero-section::before {
  display: none;
}

.hero-section::after {
  display: none;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.hero-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #1e293b;
}

.hero-title i {
  font-size: 1rem;
  color: #3b82f6;
}

.hero-subtitle {
  margin: 0;
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 400;
}

.hero-actions {
  display: flex;
  gap: 0.4rem;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.hero-btn.primary {
  background: #3b82f6;
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.hero-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  background: #2563eb;
}

.hero-btn.secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.hero-btn.secondary:hover {
  background: #e2e8f0;
  color: #334155;
}

.hero-stats {
  display: flex;
  gap: 0.5rem;
  z-index: 1;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  padding: 0.4rem 0.55rem;
  background: #f8fafc;
  border-radius: 8px;
  min-width: 55px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.stat-item:hover {
  background: #f1f5f9;
}

.stat-item i {
  font-size: 0.85rem;
  color: #3b82f6;
}

.map-mode-btn {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.map-mode-btn:hover {
  transform: scale(1.1);
}

.map-mode-btn .bi-sun-fill {
  color: #f59e0b;
}

.map-mode-btn .bi-moon-fill {
  color: #6366f1;
}

.stat-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 0.55rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.02em;
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
  position: relative;
  z-index: 1001;
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
  z-index: 1;
  padding: 0 0.5rem 0.5rem;
  overflow: hidden;
}

#map {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--neo-shadow-lg);
  border: 1px solid var(--neo-border);
  position: relative;
  z-index: 1;
}

/* 溫度圖例樣式 */
.temp-legend {
  position: absolute;
  bottom: 24px;
  right: 10px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  font-size: 0.7rem;
  backdrop-filter: blur(8px);
  max-height: calc(100% - 100px);
  overflow-y: auto;
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

/* Leaflet 容器 z-index 限制 */
.leaflet-container {
  z-index: 1 !important;
}

.leaflet-pane {
  z-index: 1 !important;
}

.leaflet-top,
.leaflet-bottom {
  z-index: 500 !important;
}

.leaflet-control {
  z-index: 500 !important;
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
  
  /* Hero section tablet optimizations */
  .hero-section {
    padding: 1rem 1.25rem;
    gap: 1rem;
  }
  
  .hero-title {
    font-size: 1.35rem;
  }
  
  .hero-section {
    max-width: 280px;
    padding: 0.8rem 1rem;
  }
  
  .hero-stats {
    gap: 0.4rem;
  }
  
  .stat-item {
    padding: 0.35rem 0.5rem;
    min-width: 50px;
  }
  
  .stat-value {
    font-size: 0.85rem;
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
  
  /* Hero section mobile - floating in map */
  .hero-section {
    top: 8px;
    left: 8px;
    max-width: 260px;
    padding: 0.7rem 0.9rem;
    gap: 0.5rem;
    border-radius: 12px;
  }
  
  .hero-title {
    font-size: 0.95rem;
  }
  
  .hero-title i {
    font-size: 0.9rem;
  }
  
  .hero-subtitle {
    font-size: 0.65rem;
  }
  
  .hero-actions {
    gap: 0.3rem;
  }
  
  .hero-btn {
    padding: 0.3rem 0.5rem;
    font-size: 0.65rem;
  }
  
  .hero-stats {
    gap: 0.35rem;
  }
  
  .stat-item {
    padding: 0.3rem 0.4rem;
    min-width: 45px;
  }
  
  .stat-value {
    font-size: 0.8rem;
  }
  
  .stat-label {
    font-size: 0.5rem;
  }
  
  #map {
    border-radius: 0;
    box-shadow: none;
  }
  
  /* 手機版溫度圖例 - 更緊湊 */
  .temp-legend {
    bottom: 20px;
    right: 8px;
    padding: 6px 8px;
    font-size: 0.6rem;
    max-height: 180px;
    border-radius: 8px;
  }
  
  .legend-title {
    font-size: 0.65rem;
    margin-bottom: 5px;
    padding-bottom: 4px;
  }
  
  .legend-items {
    gap: 3px;
  }
  
  .legend-dot {
    width: 10px;
    height: 10px;
  }
  
  .legend-item {
    gap: 5px;
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
  .hero-section {
    max-width: 200px;
    padding: 0.5rem 0.65rem;
    gap: 0.4rem;
  }
  
  .hero-title {
    font-size: 0.8rem;
  }
  
  .hero-title i {
    font-size: 0.8rem;
  }
  
  .hero-subtitle {
    font-size: 0.55rem;
  }
  
  .hero-actions {
    gap: 0.25rem;
  }
  
  .hero-btn {
    padding: 0.25rem 0.4rem;
  }
  
  .hero-btn span {
    display: none;
  }
  
  .hero-btn i {
    font-size: 0.75rem;
  }
  
  .hero-stats {
    gap: 0.2rem;
  }
  
  .stat-item {
    min-width: 38px;
    padding: 0.2rem 0.3rem;
  }
  
  .stat-value {
    font-size: 0.75rem;
  }
  
  .stat-label {
    font-size: 0.45rem;
  }
  
  /* 小手機版溫度圖例 */
  .temp-legend {
    bottom: 16px;
    right: 6px;
    padding: 5px 6px;
    font-size: 0.55rem;
    max-height: 150px;
  }
  
  .legend-title {
    font-size: 0.6rem;
    margin-bottom: 4px;
    padding-bottom: 3px;
    gap: 3px;
  }
  
  .legend-items {
    gap: 2px;
  }
  
  .legend-dot {
    width: 8px;
    height: 8px;
  }
  
  .legend-item {
    gap: 4px;
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
  .hero-section {
    max-width: 180px;
    padding: 0.4rem 0.55rem;
    top: 8px;
    left: 8px;
  }
  
  .hero-title {
    font-size: 0.75rem;
  }
  
  .hero-subtitle {
    display: none;
  }
  
  .hero-stats {
    gap: 0.15rem;
  }
  
  .stat-item {
    min-width: 32px;
    padding: 0.15rem 0.25rem;
  }
  
  .stat-value {
    font-size: 0.7rem;
  }
  
  .stat-label {
    display: none;
  }
  
  /* 超小手機溫度圖例 - 簡化版 */
  .temp-legend {
    bottom: 12px;
    right: 5px;
    padding: 4px 5px;
    font-size: 0.5rem;
    max-height: 130px;
  }
  
  .legend-title {
    font-size: 0.55rem;
    margin-bottom: 3px;
    padding-bottom: 2px;
  }
  
  .legend-title i {
    display: none;
  }
  
  .legend-items {
    gap: 1px;
  }
  
  .legend-dot {
    width: 7px;
    height: 7px;
  }
  
  .legend-item {
    gap: 3px;
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
