import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { AdminProvider } from './context/AdminContext.jsx'
import './index.css'
import App from './App.jsx'

// AdminProvider wraps the whole app, not just the admin console: hiding a
// hospital has to remove it from the public directory too, otherwise the
// admin's "remove" button would only affect their own table.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
