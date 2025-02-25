<script>
import axios from 'axios'
import NavBar from './NavBar.vue';

const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWA-FAC637E3-79B2-4800-B15D-9E19F7BB350B';

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
            sortDirection: 'high-to-low'
        };
    },
    created() {
        axios.get(url)
            .then((res) => {
            this.data = res.data.records.Station;
            //console.log(res)
            this.showdiv = true;
        }).catch((error) => {
            console.error("An error occurred:", error);
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
        }
    }
};
</script>

<template>
  <NavBar />
  <div class="weather-container overflow-auto mb-7 mt-3" style="height: calc(100vh - 150px)">
    <div class="search-panel mb-4 mt-3 p-3">
      <div class="input-group">
        <input class="form-control mr-sm-2 p-2" v-model="search" placeholder="輸入臺北/臺南/東引/澎湖等關鍵字...">
        <button type="button" class="btn btn-primary p-2">
          <i class="bi bi-search"></i>
        </button>
        <button type="button" class="temp-sort-btn ms-2" @click="toggleTemperatureSort" 
          :class="{ 'active': isSortedByTemperature, 'active-low': isSortedByTemperature && sortDirection === 'low-to-high' }">
          <i class="bi" :class="{
            'bi-thermometer-high': !isSortedByTemperature,
            'bi-sort-numeric-down-alt': isSortedByTemperature && sortDirection === 'high-to-low',
            'bi-sort-numeric-up': isSortedByTemperature && sortDirection === 'low-to-high'
          }"></i>
          {{ !isSortedByTemperature ? '依溫度排序' : 
             sortDirection === 'high-to-low' ? '溫度 (高→低)' : '溫度 (低→高)' }}
        </button>
      </div>
    </div>
    
    <div v-if="showdiv" class="weather-data p-3 p-md-4">
      <div class="row g-3">
        <weather-block v-for="(x,index) in filteredList" 
          v-bind:city="x" :citynum="index" :currentblock="false" class="col-12 col-sm-6 col-md-4"/>
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
/* 添加黑色透明背景與整體美化 */
body {
  background-color: #121212;
  color: #f0f0f0;
}

.weather-container {
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  margin: 0 auto;
  max-width: 1200px;
}

.search-panel {
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  margin: 0 auto;
  max-width: 96%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.weather-data {
  background-color: rgba(25, 25, 25, 0.6);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  margin: 0 auto;
  max-width: 96%;
}

.loading-container {
  background-color: rgba(20, 20, 20, 0.8);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(5px);
  margin: 10% auto;
  max-width: 90%;
}

.btn-outline-primary.active {
  background-color: #0d6efd;
  color: white;
}

.temp-sort-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  color: #5f9dff;
  border: 1px solid rgba(95, 157, 255, 0.2);
  font-weight: 500;
  gap: 0.5rem;
}

.temp-sort-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
  border-color: rgba(95, 157, 255, 0.5);
  background: linear-gradient(135deg, rgba(35, 35, 35, 0.95) 0%, rgba(45, 45, 45, 0.95) 100%);
}

.temp-sort-btn.active {
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.8) 0%, rgba(16, 85, 184, 0.8) 100%);
  color: white;
  border-color: #0d6efd;
}

.temp-sort-btn.active-low {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.8) 0%, rgba(30, 136, 229, 0.8) 100%);
  color: white;
  border-color: #1976d2;
}

.temp-sort-btn i {
  font-size: 1.1rem;
}

input.form-control {
  background-color: rgba(45, 45, 45, 0.7);
  border: 1px solid rgba(100, 100, 100, 0.3);
  color: #f0f0f0;
}

input.form-control::placeholder {
  color: rgba(200, 200, 200, 0.7);
}

input.form-control:focus {
  background-color: rgba(60, 60, 60, 0.8);
  box-shadow: 0 0 0 0.25rem rgba(95, 157, 255, 0.25);
  border-color: rgba(95, 157, 255, 0.5);
  color: #ffffff;
}

.btn-primary {
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.9) 0%, rgba(16, 85, 184, 0.9) 100%);
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, rgba(16, 122, 255, 0.95) 0%, rgba(20, 95, 204, 0.95) 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
  transform: translateY(-1px);
}

/* 添加滾動條美化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(30, 30, 30, 0.5);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(95, 157, 255, 0.5);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(95, 157, 255, 0.7);
}

/* 確保響應式排版 */
@media (max-width: 768px) {
  .weather-container {
    border-radius: 0;
  }
  
  .search-panel, .weather-data {
    max-width: 98%;
  }
}
</style>
