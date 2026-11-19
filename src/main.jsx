import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerServiceWorker } from './lib/pwa'
import { AuthProvider } from './context/AuthContext.jsx'
import { AdminProvider } from './context/AdminContext.jsx'
import { AppointmentsProvider } from './context/AppointmentsContext.jsx'
import './index.css'
import App from './App.jsx'

// AdminProvider wraps the whole app (not just the admin console) so that
// hiding a hospital also removes it from the public directory.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <AppointmentsProvider>
            <App />
          </AppointmentsProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

// Installable app + offline shell (production web builds only).
registerServiceWorker()
