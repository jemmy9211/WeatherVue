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
    <div class="container p-4 mt-5 fw-bold text-white bg-black bg-opacity-75">
        WeatherVue is a web application that integrates with the public API provided by the Central Weather Bureau of the Republic of China (Taiwan). Utilizing the data offered by this API, the application employs advanced visualization techniques to enhance the accessibility of complex weather data for users. The project leverages Vue, Bootstrap, and Leaflet technologies, facilitating the rapid and practical development of the web interface. The following highlights the key features of the website:
        <br>+ Real-time information from weather observation stations across Taiwan (including temperature, wind speed, forecasts, etc.).
        <br>+ Location positioning of observation stations.
        <br>+ Interactive map displaying weather observation stations throughout Taiwan (clicking on map markers provides details about the respective observation station).
        <br>+ Search functionality enabling users to obtain data related to observation stations by station name or location.
        <br>+ Radar echo map.
    </div>
    <footer class="flex-shrink-0 py-4 bg-dark text-white-50 fixed-bottom">
        <div class="container text-center">
            <small>Copyright &copy; 2023 jemmy9211 Website</small><br>
            <small>資料來自中華民國氣象局</small>
        </div>
    </footer>
</template>
