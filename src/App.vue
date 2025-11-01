<script>
</script>

<template>
<body>
    <router-view></router-view>
</body>
</template>

<style>
body {
 background-image: url("./assets/101.jpg");
 background-color: #cccccc;
 background-size: cover;
 background-position: center;
 background-attachment: fixed;
 background-repeat: no-repeat;
}

/* Responsive body adjustments */
@media (max-width: 992px) {
  body {
    background-attachment: scroll;
    background-size: cover;
  }
}

@media (max-width: 768px) {
  /* Mobile body styles */
  body {
    background-size: cover;
    background-position: center top;
  }
}

@media (max-width: 576px) {
  /* Small mobile body styles */
  body {
    background-size: auto 100vh;
  }
}

/* Prevent horizontal scroll on mobile */
body {
  overflow-x: hidden;
  width: 100%;
}

/* Optimize for touch devices */
@media (hover: none) and (pointer: coarse) {
  body {
    -webkit-overflow-scrolling: touch;
  }
}
</style>
