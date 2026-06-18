import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { MesasContextProvider } from './context/mesasContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <MesasContextProvider>
          <App />
        </MesasContextProvider>
  </React.StrictMode>,
)
