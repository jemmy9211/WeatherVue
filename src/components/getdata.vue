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
            currentlocation: null
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
            return abset;
        }
    },
    methods: {
        
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
    </div>
    <div v-if="showdiv" class="row p-3 p-md-5">
      <div class="row g-2">
        <weather-block v-for="(x,index) in filteredList" 
      v-bind:city="x" :citynum="index" :currentblock="false" class="col-12 col-sm-6 col-md-4 col-lg-3"/>
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

</style>
