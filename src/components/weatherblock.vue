<template>
  <div :class="['weather-card-container', { 'in-popup': inPopup, 'list-view': view === 'list' }]">
    <!-- Grid View -->
    <router-link v-if="view === 'grid'" class="weather-card" :to="{path:'/forcastweather',query:{userId: city.GeoInfo.CountyName,lat: city.GeoInfo.Coordinates[0].StationLatitude,lon:city.GeoInfo.Coordinates[0].StationLongitude,sname:city.StationName}}">
      <div class="card-header">
        <h3>{{ city.StationName }}</h3>
        <span class="location-badge"><i class="bi bi-geo-alt-fill"></i> {{ city.GeoInfo.CountyName }}</span>
      </div>
      
      <div class="card-body">
        <div class="temperature-display">
          <h2>{{ formatValue(city.WeatherElement.AirTemperature, '°C') }}</h2>
          <div class="weather-icon-wrapper">
            <WeatherVisual :weather="city.WeatherElement.Weather" />
          </div>
        </div>
        
        <h4 class="weather-condition">{{ formatWeather(city.WeatherElement.Weather) }}</h4>
        
        <div class="card-details">
          <div class="detail-item">
            <i class="bi bi-wind"></i>
            <span>風速: {{ formatValue(city.WeatherElement.WindSpeed, 'm/s') }}</span>
          </div>
          <div class="detail-item">
            <i class="bi bi-clock"></i>
            <span>{{ formatDateTime(city.ObsTime.DateTime) }}</span>
          </div>
        </div>
      </div>
    </router-link>

    <!-- List View -->
    <router-link v-else class="weather-list-item" :to="{path:'/forcastweather',query:{userId: city.GeoInfo.CountyName,lat: city.GeoInfo.Coordinates[0].StationLatitude,lon:city.GeoInfo.Coordinates[0].StationLongitude,sname:city.StationName}}">
        <div class="list-item-group location-group">
          <span class="station-name">{{ city.StationName }}</span>
          <span class="county-name">{{ city.GeoInfo.CountyName }}</span>
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
    formatValue(value, unit) {
      return value === -99 ? '量測中' : `${value} ${unit}`;
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

.weather-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  border-radius: var(--neo-card-radius);
  background: var(--neo-panel);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--neo-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: clamp(1rem, 1.8vw, 1.4rem);
  gap: 0.5rem;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, border-color 0.35s ease;
  position: relative;
  overflow: hidden;
}

.weather-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.weather-card:hover {
  transform: translateY(-6px) scale(1.02);
  border-color: var(--neo-accent);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3), 0 0 30px var(--neo-glow);
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--neo-border);
}

.card-header h3 {
  color: var(--neo-text);
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.location-badge {
  background: rgba(255, 255, 255, 0.05);
  color: var(--neo-muted);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid var(--neo-border);
  transition: all 0.3s ease;
}

.weather-card:hover .location-badge {
  background: var(--neo-accent);
  color: var(--neo-bg);
  border-color: var(--neo-accent);
  box-shadow: 0 0 10px var(--neo-glow);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.temperature-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.temperature-display h2 {
  color: var(--neo-text);
  font-size: clamp(2rem, 3vw, 2.4rem);
  font-weight: 700;
  text-shadow: 0 0 20px var(--neo-glow);
}

.weather-icon-wrapper {
  transform: scale(1.2);
}

.weather-condition {
  color: var(--neo-muted);
  font-size: 0.95rem;
  letter-spacing: 0.05em;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid var(--neo-border);
  padding-top: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--neo-muted);
  font-size: 0.9rem;
}

.detail-item i {
  color: var(--neo-accent);
}

.weather-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.25rem;
  background: var(--neo-panel);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--neo-border);
  border-radius: var(--neo-card-radius);
  text-decoration: none;
  gap: 1rem;
  color: var(--neo-text);
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.weather-list-item:hover {
  transform: translateY(-2px) scale(1.01);
  border-color: var(--neo-accent);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 15px var(--neo-glow);
}

.list-item-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.list-icon-wrapper {
  transform: scale(0.6);
  margin: -10px;
}

.location-group {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
}

.station-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--neo-text);
}

.county-name {
  font-size: 0.85rem;
  color: var(--neo-muted);
}

.weather-group {
  color: var(--neo-text);
}

.data-group .temperature {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--neo-text);
  text-shadow: 0 0 10px var(--neo-glow);
}

.wind-group span,
.time-group span {
  color: var(--neo-muted);
}

.wind-group i,
.time-group i {
  color: var(--neo-accent);
}

@media (max-width: 992px) {
  .weather-list-item {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .location-group,
  .data-group {
    flex-basis: calc(50% - 0.5rem);
  }
}

@media (max-width: 576px) {
  .weather-list-item {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>