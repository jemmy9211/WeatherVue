<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LCircleMarker } from "@vue-leaflet/vue-leaflet";
import axios from 'axios'
import NavBar from './NavBar.vue';
const apiKey = 'CWA-FAC637E3-79B2-4800-B15D-9E19F7BB350B';
const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${apiKey}`;

export default {
  components: {
    LMap,
    LTileLayer,
    LCircleMarker,
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
      totaldata: [],
      mapReady: false
    };
  },
  methods: {
    onMapReady() {
      this.mapReady = true;
      // 延遲觸發地圖重新計算尺寸
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.$refs.map && this.$refs.map.leafletObject) {
            this.$refs.map.leafletObject.invalidateSize();
          }
        }, 100);
      });
    }
  },
  mounted() {
    // 頁面載入後也觸發一次
    setTimeout(() => {
      if (this.$refs.map && this.$refs.map.leafletObject) {
        this.$refs.map.leafletObject.invalidateSize();
      }
    }, 500);
  },
  created(){
    this.lat=this.$route.query.lat;
    this.lon=this.$route.query.lon;
    this.sname=this.$route.query.sname;
    axios.get(url).then((res)=>{
      var tep=this.$route.query.userId;
      tep=2
      for(var i=0;i<res.data.records.location.length;i++){
        if(this.$route.query.userId==res.data.records.location[i].locationName){
          tep=i;
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
  <NavBar />
  
  <main class="forecast-page">
    <!-- 整合區塊：地點 + 預報 + 地圖(電腦版) -->
    <article class="forecast-block">
      <!-- 標題列 -->
      <header class="block-header">
        <div class="location-info">
          <i class="bi bi-geo-alt-fill"></i>
          <h1>{{ wdata.locationName }}</h1>
          <span class="divider">|</span>
          <span class="station-name">{{ sname }}</span>
        </div>
        <div class="forecast-badge">
          <i class="bi bi-clock-history"></i>
          <span>36hr</span>
        </div>
      </header>

      <!-- 主內容：左側預報 + 右側地圖(電腦版) -->
      <div class="block-content">
        <!-- 預報卡片 -->
        <div class="forecast-area">
          <forcastcom v-for="(x, idx) in totaldata" :key="idx" :forcastdata="x" :index="idx" />
        </div>
        
        <!-- 地圖 - 電腦版顯示在區塊內 -->
        <div class="map-area map-desktop">
          <l-map 
            ref="map" 
            v-model:zoom="zoom" 
            :center="[lat, lon]" 
            :useGlobalLeaflet="false"
            @ready="onMapReady"
          >
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
            ></l-tile-layer>
            <l-circle-marker 
              :lat-lng="[lat, lon]"
              :radius="10"
              fillColor="#00f2ff"
              color="#fff"
              :weight="2"
              :opacity="1"
              :fillOpacity="0.8"
            />
          </l-map>
        </div>
      </div>
    </article>
    
    <!-- 地圖獨立區塊 - 手機版顯示 -->
    <section class="map-section-mobile">
      <div class="map-header">
        <i class="bi bi-pin-map-fill"></i>
        <span>觀測站位置</span>
      </div>
      <div class="map-container">
        <l-map 
          ref="mapMobile" 
          v-model:zoom="zoom" 
          :center="[lat, lon]" 
          :useGlobalLeaflet="false"
        >
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          <l-circle-marker 
            :lat-lng="[lat, lon]"
            :radius="10"
            fillColor="#00f2ff"
            color="#fff"
            :weight="2"
            :opacity="1"
            :fillOpacity="0.8"
          />
        </l-map>
      </div>
    </section>
  </main>
</template>

<style scoped>
.forecast-page {
  width: var(--neo-max-width);
  margin: 0 auto;
  padding: 0 0.5rem 2rem;
}

/* 整合區塊 */
.forecast-block {
  background: var(--neo-panel);
  border: 1px solid var(--neo-border);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--neo-shadow-lg);
}

/* 標題列 */
.block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  background: var(--neo-surface);
  border-bottom: 1px solid var(--neo-border);
}

.location-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location-info > i {
  font-size: 1.1rem;
  color: var(--neo-accent);
}

.location-info h1 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--neo-text);
}

.divider {
  color: var(--neo-border);
  font-weight: 300;
}

.station-name {
  font-size: 0.8rem;
  color: var(--neo-muted);
}

.forecast-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  color: var(--neo-accent);
  font-size: 0.7rem;
  font-weight: 600;
}

.forecast-badge i {
  font-size: 0.75rem;
}

/* 主內容區 - 左右排列 */
.block-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 0;
}

/* 預報區 */
.forecast-area {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem;
  border-right: 1px solid var(--neo-border);
}

/* 地圖區 - 電腦版 */
.map-area {
  height: 100%;
  min-height: 280px;
  position: relative;
}

.map-area :deep(.leaflet-container) {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* Light mode - no filter needed */
.map-area :deep(.leaflet-layer),
.map-area :deep(.leaflet-control-zoom-in),
.map-area :deep(.leaflet-control-zoom-out),
.map-area :deep(.leaflet-control-attribution),
.map-container :deep(.leaflet-layer),
.map-container :deep(.leaflet-control-zoom-in),
.map-container :deep(.leaflet-control-zoom-out),
.map-container :deep(.leaflet-control-attribution) {
  /* No filter for light mode */
}

/* 手機版獨立地圖區塊 - 預設隱藏 */
.map-section-mobile {
  display: none;
}

/* 響應式 - 平板 */
@media (max-width: 992px) {
  .block-content {
    grid-template-columns: 1fr 250px;
  }
  
  .forecast-area {
    padding: 0.85rem;
    gap: 0.5rem;
  }
}

/* 響應式 - 手機：改為上下排列 */
@media (max-width: 768px) {
  .forecast-page {
    padding: 0 0.35rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  
  .forecast-block {
    border-radius: 14px;
  }
  
  .block-header {
    padding: 0.6rem 0.85rem;
  }
  
  .location-info > i {
    font-size: 0.95rem;
  }
  
  .location-info h1 {
    font-size: 0.95rem;
  }
  
  .station-name {
    font-size: 0.7rem;
  }
  
  .block-content {
    display: block;
  }
  
  .forecast-area {
    border-right: none;
    border-bottom: none;
    padding: 0.6rem;
    gap: 0.4rem;
  }
  
  /* 隱藏電腦版地圖 */
  .map-desktop {
    display: none;
  }
  
  /* 顯示手機版獨立地圖區塊 */
  .map-section-mobile {
    display: block;
    background: var(--neo-panel);
    border: 1px solid var(--neo-border);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: var(--neo-shadow);
  }
  
  .map-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 0.85rem;
    background: var(--neo-surface);
    border-bottom: 1px solid var(--neo-border);
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--neo-text);
  }
  
  .map-header i {
    color: var(--neo-accent);
    font-size: 0.85rem;
  }
  
  .map-container {
    height: 200px;
    position: relative;
  }
  
  .map-container :deep(.leaflet-container) {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

/* 響應式 - 小螢幕手機 */
@media (max-width: 576px) {
  .forecast-page {
    padding: 0 0.25rem 1rem;
    gap: 0.5rem;
  }
  
  .forecast-block {
    border-radius: 12px;
  }
  
  .block-header {
    padding: 0.5rem 0.7rem;
  }
  
  .location-info {
    gap: 0.35rem;
    flex: 1;
    min-width: 0;
  }
  
  .location-info > i {
    font-size: 0.85rem;
    flex-shrink: 0;
  }
  
  .location-info h1 {
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .divider {
    display: none;
  }
  
  .station-name {
    display: none;
  }
  
  .forecast-badge {
    padding: 0.2rem 0.45rem;
    font-size: 0.6rem;
    flex-shrink: 0;
  }
  
  .forecast-badge i {
    font-size: 0.65rem;
  }
  
  .forecast-area {
    padding: 0.5rem;
    gap: 0.35rem;
  }
  
  .map-section-mobile {
    border-radius: 12px;
  }
  
  .map-header {
    padding: 0.5rem 0.7rem;
    font-size: 0.75rem;
  }
  
  .map-header i {
    font-size: 0.8rem;
  }
  
  .map-container {
    height: 180px;
  }
}
</style>
