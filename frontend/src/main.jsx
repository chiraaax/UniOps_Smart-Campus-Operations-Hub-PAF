import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// If you are using Tailwind, your CSS import might be different, keep yours!
import './index.css' 
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)