import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './App.jsx'
import { I18nProvider } from './lib/i18n.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#FDFCFB',
            border: '1px solid #E6E1DA',
            color: '#2C2A29',
            fontFamily: 'Outfit, sans-serif',
          },
        }}
      />
    </I18nProvider>
  </React.StrictMode>
)
