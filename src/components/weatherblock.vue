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

    <!-- List View -->
    <router-link v-else class="weather-list-item" :to="{path:'/forcastweather',query:{userId: city.GeoInfo.CountyName,lat: city.GeoInfo.Coordinates[0].StationLatitude,lon:city.GeoInfo.Coordinates[0].StationLongitude,sname:city.StationName}}">
        <div class="list-item-group location-group">
          <span class="station-name">{{ city.StationName }}</span>
          <span class="county-name">{{ city.GeoInfo.CountyName }}</span>
        </div>
        <div class="list-item-group weather-group">
          <wicon v-bind:wvalue="city.WeatherElement.Weather"></wicon>
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
export default {
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
  display: grid;
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
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-top-color: rgba(255, 255, 255, 0.25);
  border-left-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.12), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  padding: 1rem;
  margin-bottom: 1rem;
}

.weather-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border-color: rgba(255, 255, 255, 0.25);
}

.in-popup .weather-card {
  margin: 0;
  padding: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 0.75rem;
  width: 100%;
}

.card-header h3 {
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 0.4rem;
  font-size: 1.2rem;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
}

.in-popup .card-header h3 {
  font-size: 1.1rem;
}

.location-badge {
  background: rgba(0, 122, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #0056b3;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid rgba(0, 122, 255, 0.15);
  box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.2);
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.temperature-display {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.5rem;
}

.temperature-display h2 {
  color: rgba(0, 0, 0, 0.9);
  font-size: 2rem;
  font-weight: 700;
  margin-right: 0.75rem;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.25);
}

.in-popup .temperature-display h2 {
  font-size: 1.8rem;
}

.weather-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: rgba(0, 0, 0, 0.75);
  opacity: 0.9;
}

.weather-condition {
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 1rem;
  text-align: left;
  font-size: 1rem;
  font-weight: 500;
}

.in-popup .weather-condition {
  font-size: 0.9rem;
}

.card-details {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.9rem;
  gap: 0.6rem;
}

.detail-item i {
  font-size: 0.9rem;
  color: rgba(0, 122, 255, 1);
}

/* Responsive design for grid view */
@media (max-width: 1200px) {
  .weather-card {
    padding: 1.25rem;
  }
}

@media (max-width: 992px) {
  /* Tablet styles */
  .weather-card {
    padding: 1.5rem;
  }
  
  .card-header h3 {
    font-size: 1.3rem;
  }
  
  .temperature-display h2 {
    font-size: 2.2rem;
  }
  
  .location-badge {
    font-size: 0.85rem;
    padding: 0.35rem 0.9rem;
  }
}

@media (max-width: 768px) {
  /* Mobile layout-only adjustments (grid view) */
  .weather-card {
    padding: 1.25rem;
    margin-bottom: 0.75rem;
  }
  
  .temperature-display {
    gap: 0.5rem;
    align-items: baseline;
    margin-bottom: 0.75rem;
  }

  .card-header {
    padding-bottom: 0.6rem;
    margin-bottom: 0.6rem;
  }
  
  .card-details {
    padding-top: 0.6rem;
  }
}

@media (max-width: 576px) {
  /* Small mobile layout-only (grid view) */
  .weather-card {
    padding: 1rem;
  }
}

/* List View Styles */
.weather-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  gap: 1rem;
}

.weather-list-item:hover {
  transform: translateY(-2px) scale(1.01);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.list-item-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.location-group {
  flex-basis: 25%;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
}
.station-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: rgba(0,0,0,0.85);
}
.county-name {
  font-size: 0.85rem;
  color: rgba(0,0,0,0.6);
}
.weather-group { flex-basis: 20%; font-size: 1rem; color: rgba(0,0,0,0.8); }
.data-group { flex-basis: 15%; }
.wind-group { flex-basis: 20%; color: rgba(0,0,0,0.7); }
.time-group { flex-basis: 20%; color: rgba(0,0,0,0.6); font-size: 0.9rem; justify-content: flex-end; }

.temperature {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(0,0,0,0.9);
}

/* Responsive design for list view */
@media (max-width: 1200px) {
  .weather-list-item {
    padding: 0.875rem 1.1rem;
    gap: 0.875rem;
  }
  
  .location-group { flex-basis: 22%; }
  .weather-group { flex-basis: 18%; font-size: 0.95rem; }
  .data-group { flex-basis: 14%; }
  .wind-group { flex-basis: 18%; }
  .time-group { flex-basis: 18%; font-size: 0.85rem; }
}

@media (max-width: 992px) {
  /* Tablet list view */
  .weather-list-item {
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 1rem;
    gap: 0.75rem;
  }
  
  .location-group { 
    flex-basis: 50%; 
    order: 1; 
    margin-bottom: 0.5rem;
  }
  
  .data-group { 
    flex-basis: 50%; 
    order: 2; 
    justify-content: flex-end; 
    margin-bottom: 0.5rem;
  }
  
  .weather-group { 
    flex-basis: 100%; 
    order: 3; 
    justify-content: center; 
    background: rgba(0,0,0,0.03); 
    padding: 0.5rem; 
    border-radius: 12px; 
    margin-bottom: 0.75rem;
  }
  
  .wind-group { flex-basis: 50%; order: 4; }
  .time-group { flex-basis: 50%; order: 5; }
}

@media (max-width: 768px) {
  /* Mobile layout-only (list view) */
  .weather-list-item {
    padding: 0.875rem;
    border-radius: 14px;
    gap: 0.6rem;
  }
  
  .wind-group, .time-group {
    font-size: 0.85rem;
  }
}

@media (max-width: 576px) {
  /* Small mobile list view */
  .weather-list-item {
    flex-direction: column;
    align-items: stretch;
    padding: 0.75rem;
    gap: 0.5rem;
  }
  
  .location-group, 
  .data-group, 
  .weather-group, 
  .wind-group, 
  .time-group {
    flex-basis: 100%;
    width: 100%;
    order: initial;
    margin-bottom: 0.25rem;
  }
  
  .location-group {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }
  
  .data-group {
    justify-content: flex-start;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }
  
  .weather-group {
    justify-content: flex-start;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .wind-group,
  .time-group {
    justify-content: flex-start;
  }
}
</style>