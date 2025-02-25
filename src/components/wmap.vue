<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer,LMarker,LControlZoom,LIcon,LPopup,LControl} from "@vue-leaflet/vue-leaflet";
import ico from "../assets/location-pin.png"
import axios from 'axios'
import NavBar from './NavBar.vue';

const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWA-FAC637E3-79B2-4800-B15D-9E19F7BB350B';
export default {
   components: {
    LMap,
    LTileLayer,
    LMarker,
    LControlZoom,
    LIcon,
    LPopup,
    LControl,
    NavBar
  },
  props:[],
  data(){
    return {
      data:null,
      zoom: 8,
      iconUrl: ico,
      showdiv: false,
      showmap:false,
      currentlocationx: '',
      currentlocationy: '',
      iconSize: 64,
      winheight:0
    }
  },
  created(){
    this.winheight=window.innerHeight
    axios.get(url)
    .then((res) => {
      this.data = res.data.records.Station
      this.showdiv=true
      //console.log(this.data)
      //for testing
    })
    .catch((error) => {
      console.error("An error occurred:", error)
      this.showdiv=false
    })
  }
};
</script>
<template>
  <div class="container-fluid">
    <div class="row">
      <NavBar />
    </div>
    <div class="row">
      <div class="alert alert-success">
        <strong>全台觀測站位置圖!</strong> 點按marker取得觀測站資料!
      </div>
    </div>
    <div class="row">
      <div v-if="showdiv" id="map" ref="myDiv" :style="{ height: winheight - 230 + 'px' }">
          <l-map ref="map" v-model:zoom="zoom" :center="[23.45889,120.9417]" :useGlobalLeaflet="false">
          <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
          ></l-tile-layer>
          <l-marker  v-for="(x,index) in data" :lat-lng="[x.GeoInfo.Coordinates[0].StationLatitude, x.GeoInfo.Coordinates[0].StationLongitude]"><l-popup><weather-block style="height: auto;width: auto;"
            v-bind:city="x" :citynum="index"/></l-popup></l-marker>
          </l-map>
      </div>
      <div v-else class="text-white text-center">
        <br><br><br><div class="spinner-border text-light"></div><br>
        <h5>中央氣象局API正在更新資料<br>
        請稍後再重新整理頁面<br>
        謝謝!</h5>
      </div>
    </div>
  </div>
</template>
<style>
#map{
  bottom: 0;
  height: 450px;
  width: 100%;
}
</style>
