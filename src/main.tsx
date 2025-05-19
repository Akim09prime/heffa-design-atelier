
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// First import the main CSS file containing Tailwind directives
import './index.css'
// Then import additional style files
import './styles/index.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
