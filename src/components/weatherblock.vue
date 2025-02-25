<template>
  <div class="col-lg-4 d-grid">
    <router-link class="weather-card" :to="{path:'/forcastweather',query:{userId: city.GeoInfo.CountyName,lat: city.GeoInfo.Coordinates[0].StationLatitude,lon:city.GeoInfo.Coordinates[0].StationLongitude,sname:city.StationName}}">
      <div class="card-header">
        <h3><strong>{{ city.StationName }}</strong></h3>
        <span class="location-badge"><i class="bi bi-geo-alt-fill"></i> {{ city.GeoInfo.CountyName }}</span>
      </div>
      
      <div class="card-body">
        <div class="temperature-display">
          <h2><strong>{{ city.WeatherElement.AirTemperature }} °C</strong></h2>
          <div class="weather-icon">
            <wicon v-bind:wvalue="city.WeatherElement.Weather"></wicon>
          </div>
        </div>
        
        <h4 class="weather-condition">{{ city.WeatherElement.Weather }}</h4>
        
        <div class="card-details">
          <div class="detail-item">
            <i class="bi bi-wind"></i>
            <span>風速: {{ city.WeatherElement.WindSpeed }} m/s</span>
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
  props:['city','citynum'],
  data(){
    return {
      data:null
    }
  },
  methods: {
    formatDateTime(dateTime) {
      if (!dateTime) return '';
      return dateTime.slice(0,16).replace('T', ' ');
    }
  }
};
</script>
  
<style scoped>
.weather-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.9) 100%);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(0, 123, 255, 0.2);
}

.weather-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0,0,0,0.2);
  border-color: rgba(0, 123, 255, 0.5);
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

.location-badge {
  background-color: rgba(13, 110, 253, 0.1);
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