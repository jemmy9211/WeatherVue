<template>
  <div :class="['weather-card-container', { 'in-popup': inPopup, 'list-view': view === 'list' }]">
    <!-- Grid View - 溫度主視覺卡片 -->
    <router-link v-if="view === 'grid'" class="weather-card" :to="{path:'/forcastweather',query:{userId: city.GeoInfo.CountyName,lat: city.GeoInfo.Coordinates[0].StationLatitude,lon:city.GeoInfo.Coordinates[0].StationLongitude,sname:city.StationName}}">
      <!-- 頂部：站名 + 地區 -->
      <div class="card-top">
        <span class="station-name">{{ city.StationName }}</span>
        <span class="county-tag">{{ city.GeoInfo.CountyName }}</span>
      </div>
      
      <!-- 中間：三欄式主視覺 -->
      <div class="card-main">
        <!-- 左側：天氣圖示 + 狀態 -->
        <div class="weather-side">
          <div class="icon-box">
            <WeatherVisual :weather="city.WeatherElement.Weather" />
          </div>
          <span class="weather-label">{{ formatWeather(city.WeatherElement.Weather) }}</span>
        </div>
        
        <!-- 中間：溫度大數字 -->
        <div class="temp-center">
          <span class="temp-value">{{ formatTemp(city.WeatherElement.AirTemperature) }}</span>
          <span class="temp-unit" v-if="city.WeatherElement.AirTemperature !== -99">°C</span>
        </div>
        
        <!-- 右側：風速 + 時間 -->
        <div class="info-side">
          <div class="info-item">
            <i class="bi bi-wind"></i>
            <span>{{ formatValue(city.WeatherElement.WindSpeed, 'm/s') }}</span>
          </div>
          <div class="info-item">
            <i class="bi bi-clock"></i>
            <span>{{ formatTime(city.ObsTime.DateTime) }}</span>
          </div>
        </div>
      </div>
    </router-link>

    <!-- List View -->
    <router-link v-else class="weather-list-item" :to="{path:'/forcastweather',query:{userId: city.GeoInfo.CountyName,lat: city.GeoInfo.Coordinates[0].StationLatitude,lon:city.GeoInfo.Coordinates[0].StationLongitude,sname:city.StationName}}">
        <div class="list-item-group location-group">
          <span class="list-station-name">{{ city.StationName }}</span>
          <span class="list-county-name">{{ city.GeoInfo.CountyName }}</span>
        </div>
        <div class="list-item-group weather-group">
          <div class="list-icon-wrapper">
            <WeatherVisual :weather="city.WeatherElement.Weather" />
          </div>
          <span class="weather-text">{{ formatWeather(city.WeatherElement.Weather) }}</span>
        </div>
        <div class="list-item-group data-group">
          <span class="temperature">{{ formatValue(city.WeatherElement.AirTemperature, '°C') }}</span>
        </div>
        <div class="list-item-group wind-group">
          <i class="bi bi-wind"></i>
          <span>{{ formatValue(city.WeatherElement.WindSpeed, 'm/s') }}</span>
        </div>
        <div class="list-item-group time-group">
          <i class="bi bi-clock"></i>
          <span>{{ formatDateTime(city.ObsTime.DateTime) }}</span>
        </div>
    </router-link>
  </div>
</template>
  
<script>
import WeatherVisual from './WeatherVisual.vue';

export default {
  components: {
    WeatherVisual
  },
  props: {
    city: Object,
    citynum: Number,
    inPopup: {
      type: Boolean,
      default: false
    },
    view: {
      type: String,
      default: 'grid'
    }
  },
  data(){
    return {
      data: null
    }
  },
  methods: {
    formatDateTime(dateTime) {
      if (!dateTime) return '';
      return dateTime.slice(0,16).replace('T', ' ');
    },
    formatTime(dateTime) {
      if (!dateTime) return '';
      return dateTime.slice(11,16);
    },
    formatValue(value, unit) {
      return value === -99 ? '量測中' : `${value} ${unit}`;
    },
    formatTemp(value) {
      return value === -99 ? '--' : value;
    },
    formatWeather(weather) {
      return weather === -99 ? '量測中' : weather;
    }
  }
};
</script>
  
<style scoped>
.weather-card-container {
  display: block;
}

.weather-card-container.list-view {
  display: block;
}

.in-popup {
  width: 100%;
  padding: 0;
}

/* ===== Grid View - 溫度主視覺卡片 ===== */
.weather-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  border-radius: 16px;
  background: var(--neo-panel);
  border: 1px solid var(--neo-border);
  box-shadow: var(--neo-shadow);
  padding: 0.85rem;
  gap: 0.5rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  position: relative;
  min-width: 0;
}

.weather-card:hover {
  transform: translateY(-4px);
  border-color: var(--neo-accent);
  box-shadow: var(--neo-shadow-lg);
}

/* 頂部區塊 */
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--neo-border);
}

.station-name {
  color: var(--neo-text);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.county-tag {
  background: #eff6ff;
  color: var(--neo-accent);
  padding: 0.15rem 0.5rem;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 500;
  border: 1px solid #dbeafe;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.weather-card:hover .county-tag {
  background: var(--neo-accent);
  color: #ffffff;
  border-color: var(--neo-accent);
}

/* 三欄主視覺區 */
.card-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.35rem 0;
}

/* 左側：天氣圖示 */
.weather-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  flex-shrink: 0;
}

.icon-box {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}

.weather-card:hover .icon-box {
  transform: scale(1.1);
}

.weather-label {
  font-size: 0.6rem;
  color: var(--neo-muted);
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 55px;
}

/* 中間：溫度大數字 */
.temp-center {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
  min-width: 0;
  padding: 0 0.25rem;
}

.temp-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  color: var(--neo-text);
  transition: transform 0.25s ease;
}

.weather-card:hover .temp-value {
  transform: scale(1.05);
  color: var(--neo-accent);
}

.temp-unit {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--neo-muted);
  margin-top: 0.1rem;
  margin-left: 0.05rem;
}

/* 右側：資訊 */
.info-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  flex-shrink: 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.4rem;
  background: var(--neo-surface);
  border-radius: 5px;
  border: 1px solid var(--neo-border);
}

.info-item i {
  font-size: 0.65rem;
  color: var(--neo-accent);
  flex-shrink: 0;
}

.info-item span {
  font-size: 0.6rem;
  color: var(--neo-muted);
  white-space: nowrap;
}

/* ===== List View 樣式 ===== */
.weather-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  background: var(--neo-panel);
  border: 1px solid var(--neo-border);
  border-radius: 12px;
  text-decoration: none;
  gap: 0.75rem;
  color: var(--neo-text);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.weather-list-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--neo-accent);
  border-radius: 3px 0 0 3px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.weather-list-item:hover {
  transform: translateY(-2px);
  border-color: var(--neo-accent);
  box-shadow: var(--neo-shadow-lg);
}

.weather-list-item:hover::before {
  opacity: 1;
}

.list-item-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.list-icon-wrapper {
  transform: scale(0.55);
  margin: -10px;
}

.location-group {
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  min-width: 90px;
}

.list-station-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--neo-text);
}

.list-county-name {
  font-size: 0.7rem;
  color: var(--neo-muted);
}

.weather-group {
  color: var(--neo-text);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.weather-text {
  font-size: 0.75rem;
  color: var(--neo-muted);
}

.data-group .temperature {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--neo-accent);
}

.wind-group,
.time-group {
  padding: 0.2rem 0.4rem;
  background: var(--neo-surface);
  border-radius: 6px;
}

.wind-group span,
.time-group span {
  color: var(--neo-muted);
  font-size: 0.7rem;
}

.wind-group i,
.time-group i {
  color: var(--neo-accent);
  font-size: 0.75rem;
}

/* ===== 響應式設計 ===== */
@media (max-width: 992px) {
  .weather-list-item {
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.6rem 0.85rem;
  }
  
  .location-group {
    flex-basis: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .wind-group,
  .time-group {
    display: none;
  }
}

/* 手機版 Grid View */
@media (max-width: 576px) {
  .weather-card {
    padding: 0.65rem;
    gap: 0.35rem;
    border-radius: 12px;
  }
  
  .card-top {
    padding-bottom: 0.35rem;
  }
  
  .station-name {
    font-size: 0.8rem;
  }
  
  .county-tag {
    padding: 0.1rem 0.35rem;
    font-size: 0.55rem;
  }
  
  .card-main {
    gap: 0.25rem;
    padding: 0.2rem 0;
  }
  
  .icon-box {
    width: 32px;
    height: 32px;
  }
  
  .weather-label {
    font-size: 0.5rem;
    max-width: 45px;
  }
  
  .temp-value {
    font-size: 1.5rem;
  }
  
  .temp-unit {
    font-size: 0.65rem;
  }
  
  .info-side {
    gap: 0.2rem;
  }
  
  .info-item {
    padding: 0.1rem 0.3rem;
  }
  
  .info-item i {
    font-size: 0.55rem;
  }
  
  .info-item span {
    font-size: 0.5rem;
  }
  
  /* 手機版 List View */
  .weather-list-item {
    padding: 0.5rem 0.7rem;
    gap: 0.4rem;
    border-radius: 10px;
  }
  
  .weather-list-item::before {
    display: none;
  }
  
  .location-group {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 0.5rem;
  }
  
  .list-station-name {
    font-size: 0.9rem;
  }
  
  .list-county-name {
    font-size: 0.7rem;
  }
  
  .weather-group {
    flex: 1;
    justify-content: center;
  }
  
  .list-icon-wrapper {
    transform: scale(0.5);
    margin: -12px;
  }
  
  .weather-text {
    display: none;
  }
  
  .data-group .temperature {
    font-size: 1.1rem;
  }
}

/* 超小螢幕 */
@media (max-width: 380px) {
  .weather-card {
    padding: 0.5rem;
  }
  
  .station-name {
    font-size: 0.75rem;
  }
  
  .county-tag {
    padding: 0.08rem 0.3rem;
    font-size: 0.5rem;
  }
  
  .temp-value {
    font-size: 1.3rem;
  }
  
  .icon-box {
    width: 28px;
    height: 28px;
  }
  
  .weather-label {
    font-size: 0.45rem;
    max-width: 40px;
  }
  
  .info-item {
    padding: 0.08rem 0.2rem;
  }
  
  .info-item i {
    font-size: 0.5rem;
  }
  
  .info-item span {
    font-size: 0.45rem;
  }
}
</style>