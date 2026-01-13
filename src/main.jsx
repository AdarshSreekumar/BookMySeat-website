import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ContextShare from './ContextShare.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextShare>
      <BrowserRouter>
        <GoogleOAuthProvider clientId='299589552272-98u93esiqdpca7d478hoc3pgju6q1uhq.apps.googleusercontent.com'>
          <App />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </ContextShare>
    
  </StrictMode>,
)
