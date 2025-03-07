import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.bundle"
import { RegionProvider } from "./RegionContext";
import { BrowserRouter } from "react-router-dom";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <RegionProvider>
      <App />
    </RegionProvider>
    </BrowserRouter>
  </StrictMode>,
)
