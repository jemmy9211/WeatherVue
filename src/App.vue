<script>
</script>

<template>
<body>
    <router-view></router-view>
</body>
</template>

<style>
:root {
  /* Minimal Light Theme */
  --neo-bg: #f8fafc;
  --neo-panel: #ffffff;
  --neo-surface: #f1f5f9;
  --neo-border: #e2e8f0;
  --neo-border-strong: #cbd5e1;
  --neo-accent: #3b82f6;
  --neo-accent-secondary: #6366f1;
  --neo-text: #1e293b;
  --neo-muted: #64748b;
  --neo-glow: rgba(59, 130, 246, 0.1);
  --neo-card-radius: 12px;
  --neo-panel-radius: 16px;
  --neo-spacing: clamp(0.75rem, 1.5vw, 1.25rem);
  --neo-font-base: 'Inter', 'Segoe UI', system-ui, sans-serif;
  --neo-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --neo-shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.08);
  --neo-max-width: min(1200px, calc(100% - 2rem));
}

html {
  background-color: var(--neo-bg);
}

body {
  background-color: var(--neo-bg);
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
  color: #ffffff;
}

/* 手機版優化 */
@media (max-width: 768px) {
  body {
    padding: 0.5rem;
    font-size: 14px;
  }
  
  :root {
    --neo-max-width: calc(100% - 1rem);
  }
}

@media (max-width: 576px) {
  body {
    padding: 0.4rem;
  }
  
  :root {
    --neo-max-width: calc(100% - 0.8rem);
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
