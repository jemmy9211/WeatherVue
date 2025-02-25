<template>
  <nav class="main-navbar">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <h5 style="color: white;"><i class="bi bi-umbrella-fill"></i> Weather App using Vue</h5>
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
  background-color: #2c3e50; /* Dark blue-gray background */
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
}

.navbar-brand {
  text-decoration: none;
  color: #3498db; /* Bright blue for the brand */
  transition: all 0.3s;
}

.navbar-brand:hover {
  transform: scale(1.05);
  color: #2ecc71; /* Green color on hover */
}

.nav-links {
  display: flex;
  gap: 0.5rem;
  border: 2px solid #34495e; /* Darker blue-gray border */
  border-radius: 8px;
  overflow: hidden;
  background-color: #34495e; /* Slightly lighter than main background */
}

.nav-btn {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #ecf0f1; /* Light gray-white text */
  background-color: transparent; /* Transparent background */
  transition: all 0.3s;
  font-weight: 500;
  border-right: 1px solid #445566; /* Subtle divider */
}

.nav-btn:last-child {
  border-right: none;
}

.nav-btn:hover {
  background-color: #3498db; /* Bright blue on hover */
  color: white;
}

.router-link-active.nav-btn {
  background-color: #2ecc71; /* Green for active state */
  color: white;
  border-right: 1px solid #445566;
}

@media (max-width: 768px) {
  .nav-links {
    flex-wrap: wrap;
  }
  
  .nav-btn {
    flex: 1 0 calc(50% - 0.5rem);
    text-align: center;
  }
}
</style>
