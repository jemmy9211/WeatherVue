<template>
  <NavBar />
  <div class="info-page">
    <div class="container py-5">
      <!-- Header Section -->
      <div class="header-section text-center mb-5 animate__animated animate__fadeIn">
        <h1 class="display-4 fw-bold mb-3">WeatherVue</h1>
        <div class="col-lg-8 mx-auto">
          <p class="lead mb-4">
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

  <footer class="glass-footer">
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

.header-section h1 {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 1) 0%,
    rgba(52, 199, 89, 1) 50%,
    rgba(255, 149, 0, 1) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-section p {
  color: rgba(40, 40, 40, 0.9);
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

.info-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.info-text {
  color: rgba(40, 40, 40, 0.9);
  font-size: 1.1rem;
  line-height: 1.7;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

.feature-heading {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 1) 0%,
    rgba(52, 199, 89, 1) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  position: relative;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.feature-item {
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 1px 4px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.feature-item:hover {
  transform: translateY(-4px) scale(1.02);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.feature-item p {
  color: rgba(40, 40, 40, 0.9);
  font-weight: 500;
  margin: 0;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

.icon {
  font-size: 1.5rem;
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 1) 0%,
    rgba(52, 199, 89, 1) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
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
  background: linear-gradient(90deg, 
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
}

.glass-footer {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding: 2rem 0;
  margin-top: auto;
  color: rgba(40, 40, 40, 0.9);
  box-shadow: 
    0 -4px 24px rgba(0, 0, 0, 0.08),
    0 -1px 4px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .feature-item {
    flex-direction: column;
  }
  
  .icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  
  .info-card {
    padding: 1.5rem;
  }
}
</style>
