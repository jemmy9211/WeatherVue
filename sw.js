if(!self.define){let e,s={};const r=(r,i)=>(r=new URL(r+".js",i).href,s[r]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=s,document.head.appendChild(e)}else e=r,importScripts(r),s()})).then((()=>{let e=s[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(i,n)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(s[l])return;let t={};const o=e=>r(e,l),u={module:{uri:l},exports:t,require:o};s[l]=Promise.all(i.map((e=>u[e]||o(e)))).then((e=>(n(...e),t)))}}define(["./workbox-e3490c72"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-gs6hXX0J.js",revision:null},{url:"assets/index-n77sJFhk.css",revision:null},{url:"assets/leaflet-src-r9KgTLRM.js",revision:null},{url:"assets/leaflet-src.esm-HdBnhJze.js",revision:null},{url:"assets/marker-icon-2x-D4k_ikNW.js",revision:null},{url:"assets/marker-icon-C2eJqgqv.js",revision:null},{url:"assets/marker-shadow-DU6CIJ0p.js",revision:null},{url:"index.html",revision:"26795219a7594fb4a2b043a572904733"},{url:"registerSW.js",revision:"7ab48594309e2dc81e734a966a2e682b"},{url:"manifest.webmanifest",revision:"b05ea37a9c636a22c6c4f09724186e6e"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
