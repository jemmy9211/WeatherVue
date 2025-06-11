<template>
  <div :class="['weather-card-container', { 'in-popup': inPopup }]">
    <router-link class="weather-card" :to="{path:'/forcastweather',query:{userId: city.GeoInfo.CountyName,lat: city.GeoInfo.Coordinates[0].StationLatitude,lon:city.GeoInfo.Coordinates[0].StationLongitude,sname:city.StationName}}">
      <div class="card-header">
        <h3><strong>{{ city.StationName }}</strong></h3>
        <span class="location-badge"><i class="bi bi-geo-alt-fill"></i> {{ city.GeoInfo.CountyName }}</span>
      </div>
      
      <div class="card-body">
        <div class="temperature-display">
          <h2><strong>{{ formatValue(city.WeatherElement.AirTemperature, '°C') }}</strong></h2>
          <div class="weather-icon">
            <wicon v-bind:wvalue="city.WeatherElement.Weather"></wicon>
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
  </div>
</template>
  
<script>
export default {
  props: {
    city: Object,
    citynum: Number,
    inPopup: {
      type: Boolean,
      default: false
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
  display: grid;
}

.in-popup {
  width: 100%;
  padding: 0;
}

.weather-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.25);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
}

.weather-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(31, 38, 135, 0.35);
}

.in-popup .weather-card {
  margin: 0;
  padding: 0.8rem;
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.15);
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.card-header h3 {
  color: #0d6efd;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.in-popup .card-header h3 {
  font-size: 1.25rem;
}

.location-badge {
  background-color: rgba(13, 110, 253, 0.15);
  color: #0d6efd;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.temperature-display {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 0.5rem;
}

.temperature-display h2 {
  color: #212529;
  font-size: 2rem;
  margin-right: 1rem;
}

.in-popup .temperature-display h2 {
  font-size: 1.5rem;
}

.weather-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
}

.weather-condition {
  color: #495057;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.25rem;
}

.in-popup .weather-condition {
  font-size: 1.1rem;
}

.card-details {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  color: #6c757d;
  font-size: 0.9rem;
  gap: 0.5rem;
}

.detail-item i {
  font-size: 1rem;
  color: #0d6efd;
}

@media (max-width: 768px) {
  .temperature-display {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .temperature-display h2 {
    margin-right: 0;
  }
}
</style>