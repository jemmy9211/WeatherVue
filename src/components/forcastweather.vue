<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer,LMarker } from "@vue-leaflet/vue-leaflet";
import axios from 'axios'
const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-FAC637E3-79B2-4800-B15D-9E19F7BB350B';
export default {
  components: {
        LMap,
        LTileLayer,
        LMarker,
  },
  props:['nowdata'],
  data() {
    return {
      zoom: 11,
      lat: '',
      lon: '',
      sname: '',
      wdata:[],
      MaxT:[],
      MinT:[],
      PoPL:[],
      Wx:[],
      totaldata:[]
    };
  },
  created(){
    this.lat=this.$route.query.lat;
    this.lon=this.$route.query.lon;
    this.sname=this.$route.query.sname;
    axios.get(url).then((res)=>{
      //console.log(res.data)
      var tep=this.$route.query.userId;
      tep=2
      //console.log(this.$route.query.userId)
      for(var i=0;i<res.data.records.location.length;i++){
        if(this.$route.query.userId==res.data.records.location[i].locationName){
          tep=i;
          //console.log(i)
        }
      }
      this.wdata=res.data.records.location[tep]
      this.MaxT=res.data.records.location[tep].weatherElement[4].time
      this.MinT=res.data.records.location[tep].weatherElement[2].time
      this.PoPL=res.data.records.location[tep].weatherElement[1].time
      this.Wx=res.data.records.location[tep].weatherElement[0].time
      for(var i=0;i<3;i++){
        this.totaldata[i]=this.Wx[i].startTime+","+this.Wx[i].endTime+","+this.PoPL[i].parameter.parameterName+","+this.MinT[i].parameter.parameterName+","+this.MaxT[i].parameter.parameterName+","+this.Wx[i].parameter.parameterName
      }
    }).catch((error) => {
      console.error("An error occurred:", error)
    })
  }
};
</script>

<template>
  <nav class="navbar p-3 text-primary-emphasis bg-light bg-opacity-75 sticky-top">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/"><h5><i class="bi bi-umbrella-fill"></i> Weather App using Vue</h5></router-link>
        <div class="btn-group btn-group-sm border border-dark border-3">
          <router-link type="button" class="btn btn-outline-dark" to="/">回首頁</router-link>
          <router-link type="button" class="btn btn-outline-dark" to="/rader">及時雷達回波圖</router-link>
          <router-link type="button" class="btn btn-outline-dark" to="/wmap">全台氣象站位置圖</router-link>
          <router-link type="button" class="btn btn-outline-dark" to="/info">網站簡介</router-link>
          <!-- <button type="button" class="btn btn-outline-dark" onclick="javascript:location.href='https://jemmy9211.github.io/'">Jemmy website</button> -->
        </div>
      </div>
  </nav>
  <div class="container-fluid">
    <div class="row">
      <div class="text-white shadow-lg p-3 bg-dark rounded bg-opacity-75">
        <h3>{{ wdata.locationName }} 未來36小時預報</h3>
      </div>
    </div>
    <div class="container overflow-auto" style="height: 800px">
      <div class="row">    
        <forcastcom v-for="x in totaldata" v-bind:forcastdata="x"></forcastcom>
        <div class="container p-5">
          <h3 class="text-white bg-black bg-opacity-50">{{sname}} 觀測站位置圖</h3>
          <div style="height:400px; width:100%" ref="myDiv" class="shadow-lg mb-5">
              <l-map ref="map" v-model:zoom="zoom" :center="[lat, lon]" :useGlobalLeaflet="false">
              <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  layer-type="base"
                  name="OpenStreetMap"
              ></l-tile-layer>
              <l-marker :lat-lng="[lat, lon]"> </l-marker>
              </l-map>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

</style>
