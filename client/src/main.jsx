import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {MousePositionProvider} from "./context/MousePositionProvider.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <MousePositionProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
      </MousePositionProvider>
  </StrictMode>,
)
