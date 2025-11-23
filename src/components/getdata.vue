<script>
import axios from 'axios'
import NavBar from './NavBar.vue';

export default {
    components: {
      NavBar
    },
    data() {
        return {
            data: [],
            search: '',
            searchkey: '',
            showdiv: false,
            showcurrent: false,
            currentlocationx: '',
            currentlocationy: '',
            currentlocation: null,
            isSortedByTemperature: false,
            sortDirection: 'high-to-low',
            viewMode: 'grid',
            errorMessage: ''
        };
    },
    created() {
        const apiKey = 'CWA-FAC637E3-79B2-4800-B15D-9E19F7BB350B';
        
        const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${apiKey}`;
        console.log("Fetching weather data...");
        
        axios.get(url)
            .then((res) => {
            this.data = res.data.records.Station;
            console.log("Data loaded successfully:", this.data.length, "stations");
            this.showdiv = true;
            this.errorMessage = '';
        }).catch((error) => {
            console.error("An error occurred:", error);
            if (error.response) {
                console.error("Response error:", error.response.status, error.response.data);
                this.errorMessage = `API 錯誤: ${error.response.status} - ${error.response.data.message || '請確認 API Key 是否正確'}`;
            } else if (error.request) {
                console.error("No response received:", error.request);
                this.errorMessage = "無法連接到氣象局 API，請檢查網路連線";
            } else {
                console.error("Error:", error.message);
                this.errorMessage = `錯誤: ${error.message}`;
            }
            this.showdiv = false;
        });
    },
    computed: {
        filteredList() {
            this.searchkey = this.search;
            this.searchkey = this.searchkey.replace('台', '臺');
            //console.log(this.searchkey)
            var aset = this.data.filter(item => item.GeoInfo.CountyName.includes(this.searchkey));
            var bset = this.data.filter(item => item.StationName.includes(this.searchkey));
            var abset = aset.concat(bset.filter((e) => { return aset.indexOf(e) === -1; }));
            
            // First sort based on whether temperature is -99 (move those to the end)
            abset.sort((a, b) => {
                const tempA = parseFloat(a.WeatherElement.AirTemperature);
                const tempB = parseFloat(b.WeatherElement.AirTemperature);
                
                // If one is -99 and the other isn't, put -99 at the end
                if (tempA === -99 && tempB !== -99) return 1;
                if (tempA !== -99 && tempB === -99) return -1;
                return 0;
            });
            
            // Then apply temperature sorting if enabled
            if (this.isSortedByTemperature) {
                return [...abset].sort((a, b) => {
                    const tempA = parseFloat(a.WeatherElement.AirTemperature);
                    const tempB = parseFloat(b.WeatherElement.AirTemperature);
                    
                    // Always put -99 at the end regardless of sort direction
                    if (tempA === -99 && tempB !== -99) return 1;
                    if (tempA !== -99 && tempB === -99) return -1;
                    
                    // Normal sort for non -99 values
                    return this.sortDirection === 'high-to-low' ? tempB - tempA : tempA - tempB;
                });
            }
            
            return abset;
        }
    },
    methods: {
        toggleTemperatureSort() {
            if (!this.isSortedByTemperature) {
                this.isSortedByTemperature = true;
                this.sortDirection = 'high-to-low';
            } else if (this.sortDirection === 'high-to-low') {
                this.sortDirection = 'low-to-high';
            } else {
                this.isSortedByTemperature = false;
            }
        },
        toggleViewMode() {
            this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
        }
    }
};
</script>

<template>
  <NavBar />
  <main class="page-shell">
  <section class="weather-container">
    <!-- Error Message -->
    <div v-if="errorMessage" class="alert alert-danger m-4" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <strong>錯誤:</strong> {{ errorMessage }}
      <div class="mt-2 small">
        請確認:
        <ul class="mb-0 mt-1">
          <li>您的 .env 檔案中有設定 VITE_CWA_KEY</li>
          <li>API Key 是有效的 (可至 <a href="https://opendata.cwa.gov.tw/" target="_blank">氣象局開放資料平台</a> 申請)</li>
          <li>重新啟動開發伺服器以載入環境變數</li>
        </ul>
      </div>
    </div>

    <div class="search-panel">
      <div class="input-group">
        <input class="neo-input" v-model="search" placeholder="輸入臺北/臺南/東引/澎湖等關鍵字...">
        <button type="button" class="btn btn-primary">
          <i class="bi bi-search"></i>
        </button>
        <button type="button" class="temp-sort-btn" @click="toggleTemperatureSort" 
          :class="{ 'active': isSortedByTemperature, 'active-low': isSortedByTemperature && sortDirection === 'low-to-high' }">
          <i class="bi" :class="{
            'bi-thermometer-high': !isSortedByTemperature,
            'bi-sort-numeric-down-alt': isSortedByTemperature && sortDirection === 'high-to-low',
            'bi-sort-numeric-up': isSortedByTemperature && sortDirection === 'low-to-high'
          }"></i>
          {{ !isSortedByTemperature ? '依溫度排序' : 
             sortDirection === 'high-to-low' ? '溫度 (高→低)' : '溫度 (低→高)' }}
        </button>
        <button type="button" class="temp-sort-btn ghost" @click="toggleViewMode" title="切換檢視模式">
          <i class="bi" :class="viewMode === 'grid' ? 'bi-list-ul' : 'bi-grid-3x3-gap-fill'"></i>
        </button>
      </div>
    </div>

    <div class="weather-scroll" v-if="showdiv">
      <div class="weather-data" :class="viewMode === 'grid' ? 'grid-view' : 'list-view-container'">
        <weather-block v-for="(x,index) in filteredList" 
          v-bind:city="x" 
          :citynum="index" 
          :currentblock="false"
          :view="viewMode"
          />
      </div>
    </div>

    <div v-else class="loading-container text-center">
      <div class="spinner-border text-light mb-3"></div>
      <h5>中央氣象局API正在更新資料<br>
      請稍後再重新整理頁面<br>
      謝謝!</h5>
    </div>
  </section>
  </main>
</template>

<style>
.page-shell {
  width: min(1200px, 100%);
  margin: 0 auto;
  padding-bottom: var(--neo-spacing);
  display: flex;
  flex-direction: column;
  gap: var(--neo-spacing);
}

/* Sci-Fi Minimalist Design System */
.weather-container {
  background: var(--neo-panel);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--neo-border);
  border-radius: var(--neo-panel-radius);
  padding: clamp(1rem, 2vw, 1.75rem);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.2);
  color: var(--neo-text);
  min-height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  gap: var(--neo-spacing);
}

.weather-container * {
  color: inherit;
}

.search-panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--neo-border);
  border-radius: var(--neo-panel-radius);
  padding: clamp(1rem, 2vw, 1.5rem);
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.2);
  transition: border-color 0.3s ease, transform 0.3s ease;
}

.search-panel:hover {
  border-color: var(--neo-accent);
  transform: translateY(-2px);
  box-shadow: 0 0 20px var(--neo-glow);
}

.input-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: clamp(0.5rem, 1.5vw, 1rem);
  align-items: center;
}

.neo-input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--neo-border);
  border-radius: 14px;
  color: var(--neo-text);
  font-family: var(--neo-font-base);
  font-size: 1rem;
  padding: 0.85rem 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.neo-input::placeholder {
  color: var(--neo-muted);
}

.neo-input:focus {
  outline: none;
  border-color: var(--neo-accent);
  box-shadow: 0 0 18px var(--neo-glow);
  background: rgba(0, 0, 0, 0.4);
}

.btn-primary {
  background: linear-gradient(135deg, var(--neo-accent), var(--neo-accent-secondary));
  border: 1px solid transparent;
  border-radius: 14px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.08em;
  padding: 0.85rem 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px var(--neo-glow);
}

.temp-sort-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--neo-border);
  transition: all 0.3s ease;
  color: var(--neo-text);
  font-family: var(--neo-font-base);
  font-weight: 600;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.temp-sort-btn.ghost {
  background: transparent;
  border-style: dashed;
}

.temp-sort-btn:hover {
  border-color: var(--neo-accent);
  color: var(--neo-accent);
  box-shadow: 0 0 18px var(--neo-glow);
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
}

.temp-sort-btn.active {
  background: linear-gradient(135deg, var(--neo-accent), var(--neo-accent-secondary));
  border-color: transparent;
  color: #fff;
  box-shadow: 0 0 20px var(--neo-glow);
}

.temp-sort-btn.active-low {
  background: linear-gradient(135deg, #e83e8c, var(--neo-accent));
}

.temp-sort-btn i {
  font-size: 1.1rem;
  color: var(--neo-accent);
}

.temp-sort-btn.active i {
  color: #fff;
}

.weather-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.weather-data {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--neo-border);
  border-radius: var(--neo-card-radius);
  padding: clamp(1rem, 1.8vw, 1.5rem);
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.2);
}

.weather-data.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: clamp(0.75rem, 1.5vw, 1.25rem);
}

.loading-container {
  background: var(--neo-surface);
  border: 1px solid var(--neo-border-strong);
  border-radius: var(--neo-panel-radius);
  padding: clamp(2rem, 5vw, 3rem);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.spinner-border {
  color: var(--neo-accent);
}

.alert {
  margin: 0;
  border-radius: var(--neo-card-radius);
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.2);
  color: #ff6b6b;
}

/* 滾動條科幻風格 */
.weather-scroll::-webkit-scrollbar {
  width: 8px;
}

.weather-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.weather-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--neo-accent), var(--neo-accent-secondary));
  border-radius: 10px;
}

.weather-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, var(--neo-accent), var(--neo-accent-secondary));
  box-shadow: 0 0 10px var(--neo-glow);
}

@media (max-width: 992px) {
  .weather-container {
    min-height: auto;
  }
  
  .input-group {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .page-shell {
    padding: 0 var(--neo-spacing);
  }
  
  .temp-sort-btn {
    width: 100%;
  }
}

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.list-view-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
