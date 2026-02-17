import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './utils/seedMaterialer'
import { runStressTestSeeder, cleanupStressTestData } from './utils/stressTestSeeder'
import App from './App.jsx'

// Expose stress test tools to console
window.runStressTestSeeder = runStressTestSeeder;
window.cleanupStressTestData = cleanupStressTestData;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
