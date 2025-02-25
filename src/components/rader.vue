<template>
  <NavBar />
  <div v-if="showdiv" class="container overflow-auto" style="height: calc(100vh - 150px)">
      <br>
      <h5><span class="badge bg-success">雷達整合回波圖-臺灣</span></h5>
      <div class="d-flex justify-content-center align-items-center h-100">
        <img v-bind:src="this.raderlink" class="img-thumbnail img-fluid" alt="雷達回波圖" style="max-height: 90%; max-width: 100%; object-fit: contain;">
      </div>
  </div>
  <div v-else class="text-white text-center">
        <br><br><br><div class="spinner-border text-light"></div><br>
        <h5>中央氣象局API正在更新資料<br>
        請稍後再重新整理頁面<br>
        謝謝!</h5>
      </div>
</template>
<script>
import axios from 'axios'
import NavBar from './NavBar.vue';

const url ='https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0058-003?Authorization=CWA-FAC637E3-79B2-4800-B15D-9E19F7BB350B&downloadType=WEB&format=JSON'
export default{
  components: {
    NavBar
  },
  data(){
    return{
      raderlink:'',
      showdiv:false
    }
  },
  created(){
    axios.get(url,{
      mode: 'no-cors'
    })
    .then((res) => {
      this.raderlink = res.data.cwaopendata.dataset.resource.ProductURL
      this.showdiv=true
      //console.log(this.raderlink)
    })
    .catch((error) => {
      console.error("An error occurred:", error)
    })
  }
}
</script>
<style>
</style>