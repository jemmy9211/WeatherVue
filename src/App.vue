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
  --neo-card-radius: 12px;
  --neo-panel-radius: 16px;
  --neo-spacing: clamp(0.75rem, 1.5vw, 1.25rem);
  --neo-font-base: 'Inter', 'Segoe UI', system-ui, sans-serif;
}

html {
  background-color: var(--neo-bg);
}

body {
  background-color: var(--neo-bg);
  /* 簡化背景 - 移除網格圖案以提升效能 */
  background-image:
    radial-gradient(ellipse at 15% 50%, rgba(0, 242, 255, 0.06) 0%, transparent 40%),
    radial-gradient(ellipse at 85% 30%, rgba(188, 19, 254, 0.06) 0%, transparent 40%);
  background-size: 100% 100%;
  background-attachment: fixed;
  color: var(--neo-text);
  font-family: var(--neo-font-base);
  font-size: 15px;
  line-height: 1.6;
  letter-spacing: 0.01em;
  min-height: 100vh;
  margin: 0;
  padding: var(--neo-spacing);
  overflow-x: hidden;
  width: 100%;
}

#app {
  min-height: calc(100vh - var(--neo-spacing) * 2);
}

a {
  color: var(--neo-accent);
  transition: color 0.15s ease;
}

a:hover {
  color: var(--neo-accent-secondary);
}

::selection {
  background: var(--neo-accent);
  color: #04060f;
}

/* 手機版優化 */
@media (max-width: 768px) {
  body {
    background-attachment: scroll;
    padding: 0.5rem;
    font-size: 14px;
  }
}

@media (max-width: 576px) {
  body {
    /* 手機上移除背景光暈以提升效能 */
    background-image: none;
    padding: 0.4rem;
  }
}

/* 觸控優化 */
@media (hover: none) and (pointer: coarse) {
  body {
    -webkit-overflow-scrolling: touch;
    -webkit-tap-highlight-color: transparent;
  }
  
  /* 增加觸控目標大小 */
  a, button {
    min-height: 44px;
    min-width: 44px;
  }
}

/* 減少動畫 - 針對偏好減少動態效果的使用者 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
