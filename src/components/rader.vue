<template>
  <NavBar />
  <div class="radar-page">
    <div v-if="showdiv" class="radar-container">
      <div class="radar-card">
        <div class="card-header">
          <h4><span class="radar-badge">雷達整合回波圖-臺灣</span></h4>
          <div class="last-updated" v-if="lastUpdated">
            最後更新: {{ lastUpdated }}
          </div>
        </div>
        <div class="card-body">
          <transition name="fade">
            <img v-bind:src="raderlink" class="radar-image" alt="雷達回波圖">
          </transition>
        </div>
        <div class="card-footer">
          <button @click="refreshData" class="refresh-button">
            <i class="bi bi-arrow-clockwise"></i> 重新整理
          </button>
        </div>
      </div>
    </div>
    <div v-else class="loading-container">
      <div class="loading-content">
        <div class="spinner"></div>
        <div class="loading-message">
          <h4>中央氣象局API正在更新資料</h4>
          <p>請稍後再重新整理頁面<br>謝謝!</p>
        </div>
      </div>
    </div>
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
      showdiv: false,
      lastUpdated: ''
    }
  },
  created(){
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios.get(url, {
        mode: 'no-cors'
      })
      .then((res) => {
        this.raderlink = res.data.cwaopendata.dataset.resource.ProductURL
        this.showdiv = true
        this.lastUpdated = new Date().toLocaleString('zh-TW')
      })
      .catch((error) => {
        console.error("An error occurred:", error)
      })
    },
    refreshData() {
      this.showdiv = false;
      setTimeout(() => {
        this.fetchData();
      }, 1000);
    }
  }
}
</script>

<style scoped>
.radar-page {
  min-height: calc(100vh - 60px);
  background: transparent;
  padding: 2rem 1rem;
}

.radar-container {
  max-width: 1000px;
  margin: 0 auto;
  height: 100%;
}

.radar-card {
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.card-header {
  padding: 1rem 1.5rem;
  background-color: rgba(41, 98, 255, 0.7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(5px);
}

.radar-badge {
  background-color: rgba(25, 118, 210, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 500;
}

.last-updated {
  font-size: 0.85rem;
  opacity: 0.9;
}

.card-body {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: rgba(245, 250, 255, 0.5);
  min-height: 400px;
}

.radar-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.radar-image:hover {
  transform: scale(1.02);
}

.card-footer {
  padding: 1rem;
  text-align: center;
  background-color: rgba(230, 240, 255, 0.5);
  backdrop-filter: blur(3px);
}

.refresh-button {
  background-color: rgba(25, 118, 210, 0.9);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.refresh-button:hover {
  background-color: rgba(13, 71, 161, 0.9);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  color: white;
}

.loading-content {
  text-align: center;
}

.spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 2rem;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

.loading-message {
  background-color: rgba(41, 98, 255, 0.5);
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.loading-message h4 {
  margin-bottom: 1rem;
  font-weight: 500;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>