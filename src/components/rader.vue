<template>
  <NavBar />
  <div class="radar-page">
    <div v-if="showdiv" class="radar-container">
      <div class="radar-card">
        <div class="card-header">
          <h4 style="font-size: smaller;"><span class="radar-badge">雷達整合回波圖-臺灣</span></h4>
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
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.radar-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.card-header {
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.radar-badge {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 0.9) 0%, 
    rgba(52, 199, 89, 0.9) 100%
  );
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  display: inline-block;
  word-break: keep-all;
  white-space: nowrap;
  box-shadow: 
    0 4px 16px rgba(0, 122, 255, 0.2),
    0 1px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.last-updated {
  font-size: 0.9rem;
  color: rgba(40, 40, 40, 0.9);
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
  margin-top: 5px;
}

.card-body {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  min-height: 400px;
}

.radar-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.radar-image:hover {
  transform: scale(1.02);
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-footer {
  padding: 1.5rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.refresh-button {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 0.9) 0%, 
    rgba(52, 120, 246, 0.9) 100%
  );
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 
    0 4px 16px rgba(0, 122, 255, 0.2),
    0 1px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.refresh-button:hover {
  transform: translateY(-2px) scale(1.05);
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 1) 0%, 
    rgba(52, 120, 246, 1) 100%
  );
  box-shadow: 
    0 6px 20px rgba(0, 122, 255, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
}

.loading-content {
  text-align: center;
}

.spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 2rem;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top-color: rgba(0, 122, 255, 1);
  animation: spin 1s ease-in-out infinite;
}

.loading-message {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  color: rgba(40, 40, 40, 0.9);
}

.loading-message h4 {
  margin-bottom: 1rem;
  font-weight: 600;
  color: rgba(40, 40, 40, 0.9);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

.loading-message p {
  color: rgba(40, 40, 40, 0.8);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
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

@media (max-width: 576px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 1rem 1.5rem;
  }
  
  .radar-badge {
    font-size: 14px;
    padding: 0.5rem 1rem;
  }
  
  .last-updated {
    align-self: flex-end;
    margin-right: 5px;
  }
  
  .radar-page {
    padding: 1rem 0.5rem;
  }
  
  .loading-message {
    padding: 1.5rem;
  }
  
  .card-body {
    padding: 1rem;
  }
}
</style>