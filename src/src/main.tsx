import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LineAuthProvider } from './contexts/LineAuthContext'
import { RegisteredUsersProvider } from './contexts/RegisteredUsersContext'
import "react-datepicker/dist/react-datepicker.css";
import './index.css'
import App from './App.tsx'

const urlParams = new URLSearchParams(window.location.search);
const lineToken = urlParams.get('line_token');
const lineRole = urlParams.get('role');

if (lineToken && lineRole) {
  localStorage.setItem('token', lineToken);
  fetch('http://localhost:8000/api/v1/auth/me', {
    headers: { 'Authorization': 'Bearer ' + lineToken }
  })
  .then(r => r.json())
  .then(user => {
    localStorage.setItem('user', JSON.stringify(user));
    let path = '/time-attendance';
    if (lineRole === 'admin') path = '/admin';
    else if (lineRole === 'advisor') path = '/teacher';
    else if (lineRole === 'supervisor') path = '/company';
    window.location.replace(path);
  })
  .catch(() => { window.location.replace('/login?error=line_error'); });
  document.getElementById('root')!.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-size:24px">Loading...</div>';
} else {
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
}
