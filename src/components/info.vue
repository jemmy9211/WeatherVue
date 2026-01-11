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
      <small>Copyright &copy; 2023 <a href="https://jemmy9211.github.io/" target="_blank" rel="noopener noreferrer">jemmy9211</a> Website</small><br>
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
  background: var(--neo-bg);
  min-height: 100vh;
  padding-bottom: 100px;
}

.header-section h1 {
  color: var(--neo-accent);
  font-weight: 700;
}

.header-section p {
  color: var(--neo-text);
  font-weight: 500;
}

.info-card {
  background: var(--neo-panel);
  border: 1px solid var(--neo-border);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: var(--neo-shadow-lg);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.info-text {
  color: var(--neo-text);
  font-size: 1.1rem;
  line-height: 1.7;
  font-weight: 500;
}

.feature-heading {
  color: var(--neo-accent);
  font-weight: 700;
  position: relative;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--neo-border);
}

.feature-item {
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  background: var(--neo-surface);
  border: 1px solid var(--neo-border);
  border-radius: 16px;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: var(--neo-shadow);
}

.feature-item:hover {
  transform: translateY(-4px) scale(1.02);
  background: var(--neo-panel);
  box-shadow: var(--neo-shadow-lg);
  border-color: var(--neo-accent);
}

.feature-item p {
  color: var(--neo-muted);
  font-weight: 500;
  margin: 0;
}

.icon {
  font-size: 1.5rem;
  color: var(--neo-accent);
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
    var(--neo-border) 50%,
    transparent 100%
  );
}

.glass-footer {
  background: var(--neo-panel);
  border-top: 1px solid var(--neo-border);
  padding: 2rem 0;
  margin-top: auto;
  color: var(--neo-muted);
  box-shadow: var(--neo-shadow);
}

/* Responsive design optimization */
@media (max-width: 1200px) {
  .container {
    padding: 0 2rem;
  }
  
  .info-card {
    padding: 2.25rem;
  }
}

@media (max-width: 992px) {
  /* Tablet styles */
  .container {
    padding: 0 1.5rem;
  }
  
  .header-section h1 {
    font-size: 2.5rem;
  }
  
  .header-section p {
    font-size: 1.05rem;
  }
  
  .info-card {
    padding: 2rem;
  }
  
  .info-text {
    font-size: 1.05rem;
  }
  
  .feature-heading {
    font-size: 1.4rem;
  }
  
  .feature-item {
    padding: 1.25rem;
  }
  
  .icon {
    font-size: 1.4rem;
  }
}

@media (max-width: 768px) {
  /* Mobile layout-only adjustments */
  .container {
    padding: 0 1rem;
  }
  
  .info-page {
    padding-bottom: 80px;
  }
  
  .header-section {
    margin-bottom: 2rem !important;
  }
  
  .header-section h1 {
    margin-bottom: 1rem !important;
  }
  
  .header-section p {
    margin-bottom: 1.5rem !important;
  }
  
  .info-card {
    padding: 1.5rem;
  }
  
  .feature-item {
    flex-direction: column;
  }
  
  .icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 576px) {
  /* Small mobile layout-only */
  .container {
    padding: 0 0.75rem;
  }
}

@media (max-width: 420px) {
  /* Extra small mobile styles */
  .header-section h1 {
    font-size: 1.5rem;
  }
  
  .info-card {
    padding: 1rem;
  }
  
  .info-text {
    font-size: 0.9rem;
  }
  
  .feature-item {
    padding: 0.75rem;
  }
  
  .feature-item p {
    font-size: 0.85rem;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .feature-item {
    -webkit-tap-highlight-color: rgba(0, 122, 255, 0.05);
  }
  
  .info-page {
    -webkit-overflow-scrolling: touch;
  }
}
</style>
