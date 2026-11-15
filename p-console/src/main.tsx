import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRoutes from './routes'
import './index.css'
import './quiet.css'
import './features.css'
import './demo.css'
import './toolkit.css'
import './cognition.css'
import './portals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
)
