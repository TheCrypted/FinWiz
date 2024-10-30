import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {MousePositionProvider} from "./context/MousePositionProvider.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <MousePositionProvider>
          <App />
      </MousePositionProvider>
  </StrictMode>,
)
