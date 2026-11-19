import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initTracker, startBeacon } from './lib/tracker'

createApp(App).mount('#app')
initTracker()
startBeacon(import.meta.env.VITE_COLLECT_URL ?? '/collect.php')
