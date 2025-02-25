<template>
  <NavBar />
  <div class="info-page">
    <div class="container py-5">
      <!-- Header Section -->
      <div class="header-section text-center mb-5 animate__animated animate__fadeIn">
        <h1 class="display-4 fw-bold mb-3" style="color: black;">WeatherVue</h1>
        <div class="col-lg-8 mx-auto">
          <p class="lead mb-4" style="color: black;">
            A modern web application that visualizes weather data from Taiwan's Central Weather Bureau.
          </p>
          <div class="divider"><span></span></div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="row justify-content-center animate__animated animate__fadeInUp">
        <div class="col-lg-10">
          <div class="info-card">
            <p class="info-text">
              WeatherVue integrates with the public API provided by the Central Weather Bureau of the Republic of China (Taiwan). 
              The application employs advanced visualization techniques to enhance the accessibility of complex weather data, 
              utilizing Vue, Bootstrap, and Leaflet technologies.
            </p>
            
            <h4 class="feature-heading mt-5 mb-4">Key Features</h4>
            <div class="row g-4">
              <div class="col-md-6">
                <div class="feature-item">
                  <i class="bi bi-thermometer-half icon"></i>
                  <p>Real-time information from weather observation stations across Taiwan (temperature, wind speed, forecasts, etc.)</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="feature-item">
                  <i class="bi bi-geo-alt icon"></i>
                  <p>Location positioning of observation stations</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="feature-item">
                  <i class="bi bi-map icon"></i>
                  <p>Interactive map displaying weather observation stations throughout Taiwan</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="feature-item">
                  <i class="bi bi-search icon"></i>
                  <p>Search functionality for finding observation stations by name or location</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="feature-item">
                  <i class="bi bi-cloud-rain icon"></i>
                  <p>Radar echo map for precipitation monitoring</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <footer class="py-4 bg-dark text-white-50">
    <div class="container text-center">
      <small>Copyright &copy; 2023 jemmy9211 Website</small><br>
      <small>資料來自中華民國氣象局</small>
    </div>
  </footer>
</template>

<script>
import NavBar from './NavBar.vue';

export default {
  components: {
    NavBar
  }
}
</script>

<style scoped>
.info-page {
  background: linear-gradient(135deg, rgba(30, 87, 153, 0.3), rgba(32, 124, 202, 0.3));
  min-height: 100vh;
  padding-bottom: 100px;
}

.info-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.info-text {
  color: #333;
  font-size: 1.1rem;
  line-height: 1.7;
}

.feature-heading {
  color: #1e5799;
  position: relative;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: black;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.icon {
  font-size: 1.5rem;
  color: #1e5799;
  margin-right: 1rem;
  flex-shrink: 0;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 2rem 0;
}

.divider span {
  flex-grow: 1;
  height: 2px;
  background: rgba(255, 255, 255, 0.6);
}

footer {
  margin-top: auto;
}

@media (max-width: 768px) {
  .feature-item {
    flex-direction: column;
  }
  
  .icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}
</style>
