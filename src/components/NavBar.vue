<template>
  <nav class="main-navbar">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <h5><i class="bi bi-umbrella-fill"></i> Weather App using Vue</h5>
      </router-link>
      <div class="nav-links">
        <router-link class="nav-btn" to="/">回首頁</router-link>
        <router-link class="nav-btn" to="/rader">及時雷達回波圖</router-link>
        <router-link class="nav-btn" to="/wmap">全台氣象站位置圖</router-link>
        <router-link class="nav-btn" to="/info">網站簡介</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style>
.main-navbar {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: 1.25rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.08),
    0 1px 4px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.container-fluid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar-brand {
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.navbar-brand h5 {
  margin: 0;
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 1) 0%,
    rgba(52, 199, 89, 1) 50%,
    rgba(255, 149, 0, 1) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.navbar-brand:hover {
  transform: translateY(-1px) scale(1.02);
}

.navbar-brand:hover h5 {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 1) 0%,
    rgba(52, 199, 89, 1) 30%,
    rgba(255, 149, 0, 1) 60%,
    rgba(255, 45, 85, 1) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 16px;
  overflow: hidden;
  padding: 0.25rem;
  box-shadow: 
    0 2px 12px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.nav-btn {
  padding: 0.75rem 1.25rem;
  text-decoration: none;
  color: rgba(40, 40, 40, 0.9);
  background: transparent;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-weight: 700;
  border-radius: 12px;
  font-size: 0.9rem;
  letter-spacing: 0.01em;
  position: relative;
  overflow: hidden;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

.nav-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.15);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.nav-btn:hover {
  color: rgba(20, 20, 20, 1);
  transform: translateY(-1px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.04);
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.4);
}

.nav-btn:hover::before {
  opacity: 1;
}

.router-link-active.nav-btn {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 0.9) 0%, 
    rgba(52, 120, 246, 0.9) 100%
  );
  color: white;
  box-shadow: 
    0 3px 12px rgba(0, 122, 255, 0.25),
    0 1px 3px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.router-link-active.nav-btn::before {
  display: none;
}

@media (max-width: 992px) {
  .main-navbar {
    padding: 1rem;
  }
  
  .container-fluid {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-btn {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 768px) {
  .nav-links {
    width: 100%;
  }
  
  .nav-btn {
    flex: 1;
    text-align: center;
    min-width: calc(50% - 0.125rem);
  }
}
</style>
