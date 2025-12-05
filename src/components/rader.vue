<template>
  <NavBar />
  <div class="radar-page">
    <div v-if="showdiv" class="radar-container">
      <div class="radar-card">
        <div class="card-header">
          <h4 style="font-size: smaller;"><span class="radar-badge">雷達整合回波圖-臺灣 (動態)</span></h4>
          <div class="last-updated" v-if="lastUpdated">
            最後更新: {{ lastUpdated }}
          </div>
        </div>
        <div class="card-body">
          <div class="radar-display">
            <div v-if="isLoadingImages" class="loading-overlay">
              <div class="spinner-small"></div>
              <span>載入動畫中...</span>
            </div>
            <img 
              v-if="currentImage"
              :src="currentImage" 
              class="radar-image" 
              alt="雷達回波圖"
            >
            <div class="controls-overlay">
              <div class="playback-controls">
                <button @click="toggleAnimation" class="control-btn play-btn">
                  <i :class="isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
                </button>
                <div class="timeline-container">
                  <span class="time-label">{{ currentDisplayTime }}</span>
                  <input 
                    type="range" 
                    min="0" 
                    :max="images.length - 1" 
                    v-model.number="currentIndex" 
                    class="timeline-slider"
                    @input="stopAnimation"
                  >
                </div>
              </div>
            </div>
          </div>
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
const apiKey = 'CWA-FAC637E3-79B2-4800-B15D-9E19F7BB350B';
const url =`https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0058-003?Authorization=${apiKey}&downloadType=WEB&format=JSON`
export default{
  components: {
    NavBar
  },
  data(){
    return{
      raderlink:'',
      showdiv: false,
      lastUpdated: '',
      images: [],
      currentIndex: 0,
      isPlaying: false,
      timer: null,
      isLoadingImages: false
    }
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex]?.url || this.raderlink;
    },
    currentDisplayTime() {
      return this.images[this.currentIndex]?.time || '';
    }
  },
  created(){
    this.fetchData();
  },
  beforeUnmount() {
    this.stopAnimation();
  },
  methods: {
    fetchData() {
      this.showdiv = false; // Hide while fetching initial data
      axios.get(url, {
        mode: 'no-cors'
      })
      .then((res) => {
        const resource = res.data.cwaopendata.dataset.resource;
        const dateTime = res.data.cwaopendata.dataset.DateTime;
        
        this.raderlink = resource.ProductURL;
        this.lastUpdated = new Date(dateTime).toLocaleString('zh-TW');
        
        this.generateImages(dateTime);
        this.showdiv = true;
      })
      .catch((error) => {
        console.error("An error occurred:", error)
        this.showdiv = true; // Show even if error (might have partial data or just empty)
      })
    },
    generateImages(latestTimeStr) {
      const latestDate = new Date(latestTimeStr);
      const imagesList = [];
      // Generate last 12 images (2 hours) with 10 min interval
      for (let i = 11; i >= 0; i--) {
        const d = new Date(latestDate.getTime() - i * 10 * 60 * 1000);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');
        
        // Using CV1_1000 for better performance (smaller size)
        // Format: https://www.cwa.gov.tw/Data/radar/CV1_1000_YYYYMMDDHHMM.png
        const timeStr = `${year}${month}${day}${hour}${minute}`;
        const url = `https://www.cwa.gov.tw/Data/radar/CV1_1000_${timeStr}.png`;
        
        imagesList.push({
          url: url,
          time: `${hour}:${minute}`
        });
      }
      
      this.images = imagesList;
      this.currentIndex = this.images.length - 1;
      this.preloadImages();
    },
    preloadImages() {
      this.isLoadingImages = true;
      let loadedCount = 0;
      const total = this.images.length;
      
      this.images.forEach(imgObj => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === total) {
            this.isLoadingImages = false;
            this.startAnimation();
          }
        };
        img.onerror = () => {
          loadedCount++; // Count errors too to avoid hanging
          if (loadedCount === total) {
            this.isLoadingImages = false;
            this.startAnimation();
          }
        };
        img.src = imgObj.url;
      });
    },
    startAnimation() {
      if (this.timer) clearInterval(this.timer);
      this.isPlaying = true;
      this.timer = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
      }, 500); // 0.5s per frame
    },
    stopAnimation() {
      this.isPlaying = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    toggleAnimation() {
      if (this.isPlaying) {
        this.stopAnimation();
      } else {
        this.startAnimation();
      }
    },
    refreshData() {
      this.stopAnimation();
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
  background: var(--neo-panel);
  border: 1px solid var(--neo-border);
  border-radius: 20px;
  box-shadow: var(--neo-shadow-lg);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.radar-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--neo-accent);
}

.card-header {
  padding: 1.5rem 2rem;
  background: var(--neo-surface);
  border-bottom: 1px solid var(--neo-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.radar-badge {
  background: var(--neo-accent);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  display: inline-block;
  word-break: keep-all;
  white-space: nowrap;
  box-shadow: var(--neo-shadow);
}

.last-updated {
  font-size: 0.9rem;
  color: var(--neo-muted);
  font-weight: 500;
  margin-top: 5px;
}

.card-body {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: var(--neo-surface);
  min-height: 400px;
}

.radar-display {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 400px;
}

.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem 2rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--neo-text);
  z-index: 10;
  border: 1px solid var(--neo-border);
  box-shadow: var(--neo-shadow-lg);
}

.spinner-small {
  width: 24px;
  height: 24px;
  border: 3px solid var(--neo-border);
  border-top-color: var(--neo-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.controls-overlay {
  width: 100%;
  margin-top: 1rem;
  padding: 0 1rem;
}

.playback-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--neo-panel);
  padding: 0.75rem 1.25rem;
  border-radius: 50px;
  border: 1px solid var(--neo-border);
  box-shadow: var(--neo-shadow);
}

.control-btn {
  background: var(--neo-accent);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.2rem;
  flex-shrink: 0;
  box-shadow: var(--neo-shadow);
}

.control-btn:hover {
  transform: scale(1.1);
  box-shadow: var(--neo-shadow-lg);
}

.timeline-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.time-label {
  color: var(--neo-text);
  font-family: monospace;
  font-size: 1rem;
  font-weight: 600;
  min-width: 50px;
}

.timeline-slider {
  flex-grow: 1;
  height: 6px;
  -webkit-appearance: none;
  background: var(--neo-border);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.timeline-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: var(--neo-accent);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--neo-shadow);
  transition: transform 0.1s;
}

.timeline-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.card-footer {
  padding: 1.5rem;
  text-align: center;
  background: var(--neo-surface);
  border-top: 1px solid var(--neo-border);
}

.refresh-button {
  background: var(--neo-accent);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: var(--neo-shadow);
}

.refresh-button:hover {
  transform: translateY(-2px) scale(1.05);
  background: var(--neo-accent-secondary);
  box-shadow: var(--neo-shadow-lg);
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
  border: 5px solid var(--neo-border);
  border-radius: 50%;
  border-top-color: var(--neo-accent);
  animation: spin 1s ease-in-out infinite;
}

.loading-message {
  background: var(--neo-panel);
  border: 1px solid var(--neo-border);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: var(--neo-shadow-lg);
  color: var(--neo-text);
}

.loading-message h4 {
  margin-bottom: 1rem;
  font-weight: 600;
  color: var(--neo-text);
}

.loading-message p {
  color: var(--neo-muted);
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

/* Responsive design optimization */
@media (max-width: 1200px) {
  .radar-container {
    max-width: 95%;
  }
  
  .radar-card {
    border-radius: 18px;
  }
}

@media (max-width: 992px) {
  /* Tablet styles */
  .radar-page {
    padding: 1.5rem 1rem;
  }
  
  .radar-container {
    max-width: 100%;
  }
  
  .radar-card {
    border-radius: 18px;
  }
  
  .card-header {
    padding: 1.25rem 1.75rem;
  }
  
  .radar-badge {
    font-size: 0.95rem;
    padding: 0.65rem 1.25rem;
  }
  
  .card-body {
    padding: 1.5rem;
    min-height: 350px;
  }
  
  .radar-image {
    max-height: 60vh;
    border-radius: 10px;
  }
  
  .refresh-button {
    padding: 0.7rem 1.75rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  /* Mobile layout-only adjustments */
  .radar-page {
    padding: 1rem 0.5rem;
  }
  
  .radar-card {
    border-radius: 16px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
  }
  
  .radar-badge {
    font-size: 0.875rem;
    padding: 0.55rem 1.1rem;
    border-radius: 20px;
  }
  
  .last-updated {
    font-size: 0.85rem;
    align-self: flex-start;
    margin-top: 0;
  }
  
  .card-body {
    padding: 1rem;
    min-height: 300px;
  }
  
  .radar-image {
    max-height: 50vh;
    border-radius: 8px;
  }
  
  .card-footer {
    padding: 1.25rem;
  }
  
  .refresh-button {
    width: 100%;
    padding: 0.875rem 1.5rem;
    border-radius: 20px;
    font-size: 0.9rem;
  }
  
  .playback-controls {
    padding: 0.5rem 1rem;
    gap: 0.75rem;
  }
  
  .control-btn {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  
  .time-label {
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  /* Small mobile styles */
  .radar-page {
    padding: 0.75rem 0.25rem;
  }
  
  .radar-card {
    border-radius: 14px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.875rem 1rem;
  }
  
  .radar-badge {
    font-size: 0.8rem;
    padding: 0.5rem 0.95rem;
    border-radius: 18px;
  }
  
  .last-updated {
    font-size: 0.8rem;
    margin-right: 0;
  }
  
  .card-body {
    padding: 0.75rem;
    min-height: 250px;
  }
  
  .radar-image {
    max-height: 45vh;
    border-radius: 8px;
  }
  
  .card-footer {
    padding: 1rem;
  }
  
  .refresh-button {
    padding: 0.75rem 1.25rem;
    border-radius: 18px;
    font-size: 0.875rem;
  }
  
  .loading-message {
    padding: 1.5rem 1rem;
  }
  
  .loading-message h4 {
    font-size: 1rem;
  }
  
  .loading-message p {
    font-size: 0.9rem;
  }
  
  .spinner {
    width: 45px;
    height: 45px;
    border-width: 4px;
  }
}

@media (max-width: 420px) {
  /* Extra small mobile styles */
  .radar-badge {
    font-size: 0.75rem;
    padding: 0.45rem 0.85rem;
  }
  
  .last-updated {
    font-size: 0.75rem;
  }
  
  .radar-image {
    max-height: 40vh;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .refresh-button {
    min-height: 44px; /* Minimum touch target size */
  }
  
  .radar-image {
    -webkit-overflow-scrolling: touch;
  }
}
</style>