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
  background: rgba(11, 17, 32, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--neo-border);
  border-radius: 24px;
  padding: 0.75rem var(--neo-spacing);
  position: sticky;
  top: 1rem;
  z-index: 1000;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  margin: 0 auto 1.5rem auto;
  width: min(1200px, calc(100% - 2rem));
}

.container-fluid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  gap: var(--neo-spacing);
}

.navbar-brand {
  text-decoration: none;
  transition: transform 0.25s ease;
  color: var(--neo-text);
}

.navbar-brand h5 {
  margin: 0;
  background: linear-gradient(135deg, var(--neo-accent), #fff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: 0.05em;
  text-shadow: 0 0 20px var(--neo-glow);
}

.navbar-brand:hover {
  transform: translateY(-1px) scale(1.02);
}

.nav-links {
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--neo-border);
  border-radius: var(--neo-panel-radius);
  overflow: hidden;
  padding: 0.35rem 0.5rem;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
}

.nav-btn {
  padding: 0.65rem 1.25rem;
  text-decoration: none;
  color: var(--neo-muted);
  background: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  border-radius: 12px;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
}

.nav-btn:hover {
  color: var(--neo-text);
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--neo-border);
  text-shadow: 0 0 8px var(--neo-glow);
}

.nav-btn.router-link-active {
  color: var(--neo-bg);
  background: var(--neo-accent);
  font-weight: 700;
  box-shadow: 0 0 15px var(--neo-glow);
  border-color: var(--neo-accent);
}

.nav-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top, rgba(0, 0, 0, 0.05), transparent 55%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-btn:hover {
  color: var(--neo-accent);
  border-color: var(--neo-border-strong);
  box-shadow: 0 0 20px var(--neo-glow);
}

.nav-btn:hover::before {
  opacity: 1;
}

.router-link-active.nav-btn {
  background: linear-gradient(135deg, var(--neo-accent), var(--neo-accent-secondary));
  border-color: var(--neo-border-strong);
  color: #fff;
  box-shadow:
    0 0 25px var(--neo-glow),
    0 12px 24px rgba(0, 0, 0, 0.05);
}

.router-link-active.nav-btn::before {
  display: none;
}

.nav-btn i {
  color: var(--neo-accent);
  margin-right: 0.4rem;
}

/* Responsive design optimization */
@media (max-width: 1200px) {
  .main-navbar {
    padding: 1.15rem 1.25rem;
  }
  
  .navbar-brand h5 {
    font-size: 1.15rem;
  }
  
  .nav-btn {
    padding: 0.7rem 1.1rem;
    font-size: 0.85rem;
  }
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
    width: 100%;
  }
  
  .nav-btn {
    padding: 0.65rem 1rem;
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
    min-width: calc(50% - 0.175rem);
  }
}

@media (max-width: 576px) {
  /* Small mobile styles */
  .main-navbar {
    padding: 0.75rem 0.65rem;
  }
  
  .container-fluid {
    gap: 0.75rem;
  }
  
  .navbar-brand h5 {
    font-size: 0.95rem;
  }
  
  .nav-links {
    padding: 0.2rem;
    gap: 0.2rem;
    border-radius: 14px;
  }
  
  .nav-btn {
    padding: 0.55rem 0.7rem;
    font-size: 0.78rem;
    border-radius: 10px;
    letter-spacing: 0.05em;
  }
}

@media (max-width: 420px) {
  /* Extra small mobile styles */
  .navbar-brand h5 {
    font-size: 0.88rem;
  }
  
  .nav-btn {
    padding: 0.5rem 0.6rem;
    font-size: 0.72rem;
    border-radius: 8px;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .nav-btn {
    min-height: 44px; /* Minimum touch target size */
  }
  
  .navbar-brand {
    -webkit-tap-highlight-color: rgba(0, 240, 255, 0.1);
  }
}
</style>
