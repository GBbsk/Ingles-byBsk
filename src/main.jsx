import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { PlaylistProvider } from './context/PlaylistContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Adicione a propriedade basename aqui */}
    <PlaylistProvider>
      <BrowserRouter basename="/">
        <App />
      </BrowserRouter>
    </PlaylistProvider>
  </React.StrictMode>,
)