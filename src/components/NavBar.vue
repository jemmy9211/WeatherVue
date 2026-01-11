<template>
  <nav class="main-navbar">
    <div class="container-fluid">
      <!-- Logo -->
      <router-link class="navbar-brand" to="/">
        <h5><i class="bi bi-umbrella-fill"></i> TWeather</h5>
      </router-link>
      
      <!-- 搜尋篩選區（首頁和地圖頁顯示） -->
      <div v-if="showFilter" class="search-filter-group">
        <select class="neo-select-sm" :value="selectedCounty" @change="$emit('update:selectedCounty', $event.target.value)">
          <option value="">全部縣市</option>
          <option v-for="county in counties" :key="county" :value="county">{{ county }}</option>
        </select>
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input 
            type="text" 
            class="neo-input-sm" 
            :value="search" 
            @input="$emit('update:search', $event.target.value)"
            placeholder="搜尋站名..."
          >
        </div>
        <button v-if="selectedCounty || search" class="clear-btn-sm" @click="$emit('clear')" title="清除篩選">
          <i class="bi bi-x"></i>
        </button>
      </div>
      
      <!-- 導航連結 -->
      <div class="nav-links">
        <router-link class="nav-btn" to="/"><i class="bi bi-map-fill"></i><span>首頁</span></router-link>
        <router-link class="nav-btn" to="/locations"><i class="bi bi-geo-alt-fill"></i><span>地點</span></router-link>
        <router-link class="nav-btn" to="/rader"><i class="bi bi-radar"></i><span>雷達</span></router-link>
        <router-link class="nav-btn" to="/info"><i class="bi bi-info-circle-fill"></i><span>關於</span></router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    showFilter: {
      type: Boolean,
      default: false
    },
    selectedCounty: {
      type: String,
      default: ''
    },
    search: {
      type: String,
      default: ''
    }
  },
  emits: ['update:selectedCounty', 'update:search', 'clear'],
  data() {
    return {
      counties: [
        '臺北市', '新北市', '基隆市', '桃園市', '新竹市', '新竹縣',
        '苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣',
        '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣',
        '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'
      ]
    }
  }
}
</script>

<style>
.main-navbar {
  background: var(--neo-panel);
  border: 1px solid var(--neo-border);
  border-radius: 16px;
  padding: 0.5rem 0.75rem;
  position: sticky;
  top: 0.75rem;
  z-index: 1000;
  box-shadow: var(--neo-shadow-lg);
  margin: 0 auto 1rem auto;
  width: var(--neo-max-width);
}

.container-fluid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  gap: 0.75rem;
}

.navbar-brand {
  text-decoration: none;
  color: var(--neo-text);
  flex-shrink: 0;
}

.navbar-brand h5 {
  margin: 0;
  color: var(--neo-accent);
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.02em;
}

/* 搜尋篩選區 */
.search-filter-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  max-width: 400px;
  background: var(--neo-surface);
  border: 1px solid var(--neo-border);
  border-radius: 10px;
  padding: 0.25rem 0.4rem;
}

.neo-select-sm {
  background: transparent;
  border: none;
  color: var(--neo-text);
  font-size: 0.75rem;
  padding: 0.35rem 0.5rem;
  cursor: pointer;
  min-width: 85px;
  max-width: 100px;
}

.neo-select-sm:focus {
  outline: none;
}

.neo-select-sm option {
  background: var(--neo-panel);
  color: var(--neo-text);
}

.search-box {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 0.3rem;
  border-left: 1px solid var(--neo-border);
  padding-left: 0.4rem;
}

.search-box i {
  color: var(--neo-muted);
  font-size: 0.75rem;
  flex-shrink: 0;
}

.neo-input-sm {
  background: transparent;
  border: none;
  color: var(--neo-text);
  font-size: 0.75rem;
  padding: 0.35rem 0.25rem;
  width: 100%;
  min-width: 0;
}

.neo-input-sm::placeholder {
  color: var(--neo-muted);
}

.neo-input-sm:focus {
  outline: none;
}

.clear-btn-sm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #fef2f2;
  border: none;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.clear-btn-sm:hover {
  background: #fee2e2;
}

.clear-btn-sm i {
  font-size: 0.7rem;
}

/* 導航連結 */
.nav-links {
  display: flex;
  gap: 0.2rem;
  background: var(--neo-surface);
  border: 1px solid var(--neo-border);
  border-radius: 10px;
  padding: 0.2rem;
  flex-shrink: 0;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.65rem;
  text-decoration: none;
  color: var(--neo-muted);
  background: transparent;
  transition: all 0.2s ease;
  font-weight: 500;
  border-radius: 8px;
  font-size: 0.75rem;
  white-space: nowrap;
}

.nav-btn i {
  font-size: 0.85rem;
}

.nav-btn:hover {
  color: var(--neo-text);
  background: var(--neo-panel);
}

.router-link-active.nav-btn {
  background: var(--neo-accent);
  color: #fff;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 992px) {
  .container-fluid {
    flex-wrap: nowrap;
    gap: 0.5rem;
  }
  
  .search-filter-group {
    display: none;
  }
  
  .nav-btn span {
    display: none;
  }
  
  .nav-btn {
    padding: 0.45rem 0.6rem;
  }
  
  .nav-btn i {
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .main-navbar {
    padding: 0.4rem 0.5rem;
    border-radius: 12px;
    top: 0.5rem;
    margin-bottom: 0.75rem;
  }
  
  .container-fluid {
    gap: 0.4rem;
  }
  
  .navbar-brand h5 {
    font-size: 0.85rem;
  }
  
  .search-filter-group {
    padding: 0.2rem 0.35rem;
    border-radius: 8px;
    gap: 0.3rem;
  }
  
  .neo-select-sm {
    font-size: 0.7rem;
    padding: 0.3rem 0.4rem;
    min-width: 75px;
  }
  
  .search-box {
    padding-left: 0.35rem;
  }
  
  .search-box i {
    font-size: 0.7rem;
  }
  
  .neo-input-sm {
    font-size: 0.7rem;
    padding: 0.3rem 0.2rem;
  }
  
  .clear-btn-sm {
    width: 20px;
    height: 20px;
  }
  
  .nav-links {
    padding: 0.15rem;
    gap: 0.15rem;
    border-radius: 8px;
  }
  
  .nav-btn {
    padding: 0.35rem 0.5rem;
    border-radius: 6px;
  }
  
  .nav-btn i {
    font-size: 0.9rem;
  }
}

@media (max-width: 380px) {
  .navbar-brand h5 {
    font-size: 0.75rem;
  }
  
  .neo-select-sm {
    min-width: 65px;
    font-size: 0.65rem;
  }
  
  .neo-input-sm {
    font-size: 0.65rem;
  }
  
  .nav-btn {
    padding: 0.3rem 0.4rem;
  }
  
  .nav-btn i {
    font-size: 0.8rem;
  }
}

/* Touch devices */
@media (hover: none) and (pointer: coarse) {
  .nav-btn {
    min-height: 36px;
  }
  
  .neo-select-sm,
  .neo-input-sm {
    min-height: 32px;
  }
}
</style>
