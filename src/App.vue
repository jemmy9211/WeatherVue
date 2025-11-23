<script>
</script>

<template>
<body>
    <router-view></router-view>
</body>
</template>

<style>
:root {
  --neo-bg: #0b1120;
  --neo-panel: rgba(30, 41, 59, 0.6);
  --neo-surface: rgba(15, 23, 42, 0.6);
  --neo-border: rgba(255, 255, 255, 0.08);
  --neo-border-strong: rgba(255, 255, 255, 0.15);
  --neo-accent: #00f2ff;
  --neo-accent-secondary: #bc13fe;
  --neo-text: #e2e8f0;
  --neo-muted: #94a3b8;
  --neo-glow: rgba(0, 242, 255, 0.15);
  --neo-card-radius: 16px;
  --neo-panel-radius: 20px;
  --neo-spacing: clamp(1rem, 2vw, 1.5rem);
  --neo-font-base: 'Space Grotesk', 'Inter', 'Segoe UI', system-ui, sans-serif;
}

html {
  background-color: var(--neo-bg);
}

body {
  background-color: var(--neo-bg);
  background-image:
    radial-gradient(circle at 15% 50%, rgba(0, 242, 255, 0.08) 0%, transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(188, 19, 254, 0.08) 0%, transparent 25%),
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 50px 50px, 50px 50px;
  background-position: center;
  background-attachment: fixed;
  color: var(--neo-text);
  font-family: var(--neo-font-base);
  font-size: 16px;
  line-height: 1.7;
  letter-spacing: 0.02em;
  min-height: 100vh;
  margin: 0;
  padding: var(--neo-spacing);
}

#app {
  min-height: calc(100vh - var(--neo-spacing));
}

a {
  color: var(--neo-accent);
  transition: color 0.2s ease;
}

a:hover,
a:focus-visible {
  color: var(--neo-accent-secondary);
}

::selection {
  background: var(--neo-accent-secondary);
  color: #04060f;
}

/* Responsive body adjustments */
@media (max-width: 992px) {
  body {
    background-attachment: scroll;
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
