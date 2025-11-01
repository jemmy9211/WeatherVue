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
  <div class="weather-container overflow-auto mb-7 mt-3" style="height: calc(100vh - 150px)">
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

    <div class="search-panel mb-4 mt-3 p-4">
      <div class="input-group">
        <input class="form-control mr-sm-2 p-3" v-model="search" placeholder="輸入臺北/臺南/東引/澎湖等關鍵字...">
        <button type="button" class="btn btn-primary p-3">
          <i class="bi bi-search"></i>
        </button>
        <button type="button" class="temp-sort-btn ms-3" @click="toggleTemperatureSort" 
          :class="{ 'active': isSortedByTemperature, 'active-low': isSortedByTemperature && sortDirection === 'low-to-high' }">
          <i class="bi" :class="{
            'bi-thermometer-high': !isSortedByTemperature,
            'bi-sort-numeric-down-alt': isSortedByTemperature && sortDirection === 'high-to-low',
            'bi-sort-numeric-up': isSortedByTemperature && sortDirection === 'low-to-high'
          }"></i>
          {{ !isSortedByTemperature ? '依溫度排序' : 
             sortDirection === 'high-to-low' ? '溫度 (高→低)' : '溫度 (低→高)' }}
        </button>
        <button type="button" class="temp-sort-btn ms-2" @click="toggleViewMode" title="切換檢視模式">
          <i class="bi" :class="viewMode === 'grid' ? 'bi-list-ul' : 'bi-grid-3x3-gap-fill'"></i>
        </button>
      </div>
    </div>
    
    <div v-if="showdiv" class="weather-data p-4">
      <div :class="viewMode === 'grid' ? 'row g-3' : 'list-view-container'">
        <weather-block v-for="(x,index) in filteredList" 
          v-bind:city="x" 
          :citynum="index" 
          :currentblock="false"
          :view="viewMode"
          :class="viewMode === 'grid' ? 'col-12 col-sm-6 col-md-4 col-lg-3' : 'col-12'"
          />
      </div>
    </div>
    
    <div v-else class="loading-container text-white text-center py-5">
      <div class="spinner-border text-light mb-3"></div>
      <h5>中央氣象局API正在更新資料<br>
      請稍後再重新整理頁面<br>
      謝謝!</h5>
    </div>
  </div>
</template>

<style>
/* Apple Liquid Glass Design System */
body {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 0.1) 0%,
    rgba(88, 86, 214, 0.1) 25%,
    rgba(255, 45, 85, 0.1) 50%,
    rgba(52, 199, 89, 0.1) 75%,
    rgba(255, 149, 0, 0.1) 100%
  );
  background-attachment: fixed;
  color: rgba(255, 255, 255, 0.95);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
}

.weather-container {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.125);
  border-radius: 24px;
  margin: 0 auto;
  max-width: 1200px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.search-panel {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  margin: 0 auto;
  max-width: 96%;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.search-panel:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 28px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.weather-data {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  margin: 0 auto;
  max-width: 96%;
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.06),
    0 1px 4px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.loading-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 3rem;
  margin: 10% auto;
  max-width: 90%;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.temp-sort-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  color: rgba(0, 122, 255, 1);
  font-weight: 700;
  gap: 0.75rem;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  font-size: 0.9rem;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.temp-sort-btn:hover {
  transform: translateY(-2px) scale(1.02);
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  color: rgba(0, 122, 255, 1);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.temp-sort-btn.active {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 0.9) 0%, 
    rgba(52, 120, 246, 0.9) 100%
  );
  color: white;
  border-color: rgba(0, 122, 255, 0.4);
  box-shadow: 
    0 4px 16px rgba(0, 122, 255, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.temp-sort-btn.active-low {
  background: linear-gradient(135deg, 
    rgba(52, 199, 89, 0.9) 0%, 
    rgba(48, 176, 199, 0.9) 100%
  );
  border-color: rgba(52, 199, 89, 0.4);
  box-shadow: 
    0 4px 16px rgba(52, 199, 89, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.temp-sort-btn i {
  font-size: 1.2rem;
}

input.form-control {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  color: #000;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-size: 1rem;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

input.form-control::placeholder {
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
  text-shadow: none;
}

input.form-control:focus {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(0, 122, 255, 0.6);
  box-shadow: 
    0 0 0 3px rgba(0, 122, 255, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  color: #000;
  transform: translateY(-1px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}

.btn-primary {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 0.9) 0%, 
    rgba(52, 120, 246, 0.9) 100%
  );
  border: 1px solid rgba(0, 122, 255, 0.3);
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-weight: 700;
  color: white;
  box-shadow: 
    0 3px 12px rgba(0, 122, 255, 0.25),
    0 1px 3px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 1) 0%, 
    rgba(52, 120, 246, 1) 100%
  );
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 6px 20px rgba(0, 122, 255, 0.35),
    0 2px 6px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
}

/* 滾動條液態玻璃效果 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 0.6) 0%, 
    rgba(52, 199, 89, 0.6) 100%
  );
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 0.8) 0%, 
    rgba(52, 199, 89, 0.8) 100%
  );
}

/* Responsive design optimization */
@media (max-width: 1200px) {
  .weather-container {
    max-width: 95%;
    margin: 0 auto;
  }
}

@media (max-width: 992px) {
  /* Tablet styles */
  .weather-container {
    border-radius: 18px;
    margin: 0 1rem;
    height: calc(100vh - 180px);
  }
  
  .search-panel {
    padding: 1rem;
  }
  
  .input-group {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .temp-sort-btn {
    padding: 0.7rem 1.1rem;
    font-size: 0.875rem;
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }
  
  .temp-sort-btn:nth-child(3) {
    margin-left: 0 !important;
  }
  
  .temp-sort-btn:nth-child(4) {
    margin-left: 0 !important;
    min-width: 60px;
    flex: 0;
  }
}

@media (max-width: 768px) {
  /* Mobile layout-only adjustments */
  .weather-container {
    margin: 0.5rem;
    height: calc(100vh - 170px);
  }
  
  .search-panel, .weather-data {
    max-width: 98%;
    padding: 0.75rem !important;
  }
  
  .input-group {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  input.form-control {
    width: 100% !important;
    padding: 0.875rem !important;
  }
  
  .btn-primary {
    width: 100%;
    padding: 0.875rem !important;
  }
  
  .temp-sort-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    margin: 0 !important;
    justify-content: center;
  }
  
  .row.g-3 {
    gap: 1rem !important;
  }
  
  .weather-data {
    padding: 0.75rem !important;
  }
  
  .loading-container {
    max-width: 95%;
    padding: 2rem 1rem;
  }
}

@media (max-width: 576px) {
  /* Small mobile layout-only */
  .weather-container {
    margin: 0.25rem;
  }
  
  .search-panel {
    margin-top: 0.5rem !important;
    margin-bottom: 0.5rem !important;
  }
  
  input.form-control {
    padding: 0.75rem !important;
  }
  
  .btn-primary {
    padding: 0.75rem !important;
  }
  
  .temp-sort-btn {
    padding: 0.65rem 0.875rem;
    gap: 0.5rem;
  }
}

/* 提升動畫流暢度 */
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
