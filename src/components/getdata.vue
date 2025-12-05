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
            selectedCounty: '',
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
            let result = this.data;
            
            // 先用縣市篩選
            if (this.selectedCounty) {
                result = result.filter(item => item.GeoInfo.CountyName === this.selectedCounty);
            }
            
            // 再用關鍵字搜尋
            if (this.search) {
                const searchkey = this.search.replace('台', '臺');
                var aset = result.filter(item => item.GeoInfo.CountyName.includes(searchkey));
                var bset = result.filter(item => item.StationName.includes(searchkey));
                result = aset.concat(bset.filter((e) => { return aset.indexOf(e) === -1; }));
            }
            
            // First sort based on whether temperature is -99 (move those to the end)
            result.sort((a, b) => {
                const tempA = parseFloat(a.WeatherElement.AirTemperature);
                const tempB = parseFloat(b.WeatherElement.AirTemperature);
                
                // If one is -99 and the other isn't, put -99 at the end
                if (tempA === -99 && tempB !== -99) return 1;
                if (tempA !== -99 && tempB === -99) return -1;
                return 0;
            });
            
            // Then apply temperature sorting if enabled
            if (this.isSortedByTemperature) {
                return [...result].sort((a, b) => {
                    const tempA = parseFloat(a.WeatherElement.AirTemperature);
                    const tempB = parseFloat(b.WeatherElement.AirTemperature);
                    
                    // Always put -99 at the end regardless of sort direction
                    if (tempA === -99 && tempB !== -99) return 1;
                    if (tempA !== -99 && tempB === -99) return -1;
                    
                    // Normal sort for non -99 values
                    return this.sortDirection === 'high-to-low' ? tempB - tempA : tempA - tempB;
                });
            }
            
            return result;
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
        },
        clearFilters() {
            this.selectedCounty = '';
            this.search = '';
        }
    }
};
</script>

<template>
  <NavBar 
    :showFilter="true"
    v-model:selectedCounty="selectedCounty"
    v-model:search="search"
    @clear="clearFilters"
  />
  <main class="page-shell">
  <section class="weather-container">
    <!-- Error Message -->
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <strong>錯誤:</strong> {{ errorMessage }}
    </div>

    <!-- 功能按鈕列 -->
    <div class="action-bar">
      <div class="result-count">
        <i class="bi bi-pin-map-fill"></i>
        <span>{{ filteredList.length }} 個站點</span>
      </div>
      <div class="action-buttons">
        <button type="button" class="action-btn" @click="toggleTemperatureSort" 
          :class="{ 'active': isSortedByTemperature, 'active-low': isSortedByTemperature && sortDirection === 'low-to-high' }">
          <i class="bi" :class="{
            'bi-thermometer-high': !isSortedByTemperature,
            'bi-sort-numeric-down-alt': isSortedByTemperature && sortDirection === 'high-to-low',
            'bi-sort-numeric-up': isSortedByTemperature && sortDirection === 'low-to-high'
          }"></i>
          <span>{{ !isSortedByTemperature ? '溫度排序' : 
             sortDirection === 'high-to-low' ? '高→低' : '低→高' }}</span>
        </button>
        <button type="button" class="action-btn ghost" @click="toggleViewMode" title="切換檢視模式">
          <i class="bi" :class="viewMode === 'grid' ? 'bi-list-ul' : 'bi-grid-3x3-gap-fill'"></i>
          <span>{{ viewMode === 'grid' ? '列表' : '格狀' }}</span>
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
  width: var(--neo-max-width);
  margin: 0 auto;
  padding-bottom: var(--neo-spacing);
  display: flex;
  flex-direction: column;
  gap: var(--neo-spacing);
}

/* Minimal Light Design System */
.weather-container {
  background: var(--neo-panel);
  border: 1px solid var(--neo-border);
  border-radius: var(--neo-panel-radius);
  padding: clamp(0.75rem, 2vw, 1.5rem);
  box-shadow: var(--neo-shadow-lg);
  color: var(--neo-text);
  min-height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.weather-container * {
  color: inherit;
}

/* 功能列 */
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: var(--neo-surface);
  border: 1px solid var(--neo-border);
  border-radius: 12px;
}

.result-count {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--neo-muted);
  font-size: 0.8rem;
}

.result-count i {
  color: var(--neo-accent);
  font-size: 0.85rem;
}

.action-buttons {
  display: flex;
  gap: 0.4rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  background: var(--neo-panel);
  border: 1px solid var(--neo-border);
  transition: all 0.2s ease;
  color: var(--neo-text);
  font-family: var(--neo-font-base);
  font-weight: 500;
  font-size: 0.75rem;
  gap: 0.35rem;
  white-space: nowrap;
  cursor: pointer;
}

.action-btn.ghost {
  background: transparent;
  border-style: dashed;
}

.action-btn:hover {
  border-color: var(--neo-accent);
  color: var(--neo-accent);
  box-shadow: var(--neo-shadow);
}

.action-btn.active {
  background: var(--neo-accent);
  border-color: var(--neo-accent);
  color: #fff;
}

.action-btn.active-low {
  background: var(--neo-accent-secondary);
  border-color: var(--neo-accent-secondary);
}

.action-btn i {
  font-size: 0.85rem;
}

.action-btn.active i {
  color: #fff;
}

.weather-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.weather-data {
  background: var(--neo-surface);
  border: 1px solid var(--neo-border);
  border-radius: 12px;
  padding: clamp(0.5rem, 1.2vw, 1rem);
}

.weather-data.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: clamp(0.5rem, 1vw, 0.85rem);
}

.loading-container {
  background: var(--neo-surface);
  border: 1px solid var(--neo-border);
  border-radius: 16px;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  letter-spacing: 0.1em;
  text-align: center;
}

.spinner-border {
  color: var(--neo-accent) !important;
}

.alert {
  margin: 0;
  border-radius: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
}

/* 滾動條簡化 */
.weather-scroll::-webkit-scrollbar {
  width: 6px;
}

.weather-scroll::-webkit-scrollbar-track {
  background: var(--neo-surface);
}

.weather-scroll::-webkit-scrollbar-thumb {
  background: var(--neo-border-strong);
  border-radius: 6px;
}

.weather-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--neo-accent);
}

@media (max-width: 992px) {
  .weather-container {
    min-height: auto;
  }
}

@media (max-width: 768px) {
  .weather-data.grid-view {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.5rem;
  }
}

@media (max-width: 576px) {
  .page-shell {
    padding: 0;
  }
  
  .weather-container {
    padding: 0.6rem;
    border-radius: 14px;
    gap: 0.5rem;
  }
  
  .action-bar {
    padding: 0.4rem 0.6rem;
    border-radius: 10px;
    gap: 0.5rem;
  }
  
  .result-count {
    font-size: 0.7rem;
  }
  
  .result-count i {
    font-size: 0.75rem;
  }
  
  .action-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.7rem;
    border-radius: 6px;
  }
  
  .action-btn i {
    font-size: 0.75rem;
  }
  
  .weather-data {
    padding: 0.4rem;
    border-radius: 10px;
  }
  
  /* 手機版改為單欄布局，避免第二個 block 被截斷 */
  .weather-data.grid-view {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }
}

/* 超小螢幕 */
@media (max-width: 380px) {
  .action-btn span {
    display: none;
  }
  
  .action-btn {
    padding: 0.4rem 0.5rem;
  }
}

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.list-view-container {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
</style>
