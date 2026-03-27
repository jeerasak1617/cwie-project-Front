import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LineAuthProvider } from './contexts/LineAuthContext'
import { RegisteredUsersProvider } from './contexts/RegisteredUsersContext'
import "react-datepicker/dist/react-datepicker.css";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LineAuthProvider>
          <RegisteredUsersProvider>
            <App />
          </RegisteredUsersProvider>
        </LineAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)