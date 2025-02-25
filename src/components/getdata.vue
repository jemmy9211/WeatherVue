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
            isSortedByTemperature: false
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
            
            // Apply temperature sorting if enabled - changed to high-to-low
            if (this.isSortedByTemperature) {
                return [...abset].sort((a, b) => {
                    const tempA = parseFloat(a.WeatherElement.AirTemperature);
                    const tempB = parseFloat(b.WeatherElement.AirTemperature);
                    return tempB - tempA; // Changed to sort from high to low
                });
            }
            
            return abset;
        }
    },
    methods: {
        toggleTemperatureSort() {
            this.isSortedByTemperature = !this.isSortedByTemperature;
        }
    }
};
</script>

<template>
  <NavBar />
  <div class="container overflow-auto mb-7" style="height: calc(100vh - 150px)">
    <div class="input-group mb-3 mt-3">
      <input class="form-control mr-sm-2 p-2" v-model="search" placeholder="輸入臺北/臺南/東引/澎湖等關鍵字...">
      <button type="button" class="btn btn-primary p-2">
        <i class="bi bi-search"></i>
      </button>
      <button type="button" class="temp-sort-btn ms-2" @click="toggleTemperatureSort" :class="{ 'active': isSortedByTemperature }">
        <i class="bi" :class="isSortedByTemperature ? 'bi-sort-numeric-down-alt' : 'bi-thermometer-high'"></i>
        {{ isSortedByTemperature ? '恢復順序' : '依溫度排序 (高→低)' }}
      </button>
    </div>
    <div v-if="showdiv" class="row p-3 p-md-5">
      <div class="row g-2">
        <weather-block v-for="(x,index) in filteredList" 
      v-bind:city="x" :citynum="index" :currentblock="false" class="col-12 col-sm-6 col-md-4"/>
      </div>
    </div>
    <div v-else class="text-white text-center py-5">
      <div class="spinner-border text-light mb-3"></div>
      <h5>中央氣象局API正在更新資料<br>
      請稍後再重新整理頁面<br>
      謝謝!</h5>
    </div>
  </div>
</template>

<style>
.btn-outline-primary.active {
  background-color: #0d6efd;
  color: white;
}

.temp-sort-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.9) 100%);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  color: #0d6efd;
  border: 1px solid rgba(0, 123, 255, 0.2);
  font-weight: 500;
  gap: 0.5rem;
}

.temp-sort-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
  border-color: rgba(0, 123, 255, 0.5);
}

.temp-sort-btn.active {
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.9) 0%, rgba(16, 85, 184, 0.9) 100%);
  color: white;
  border-color: #0d6efd;
}

.temp-sort-btn i {
  font-size: 1.1rem;
}
</style>
