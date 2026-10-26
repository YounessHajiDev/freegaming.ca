import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { PrerenderProvider, readPrerenderData } from './lib/prerender'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <PrerenderProvider data={readPrerenderData()}>
        <App />
      </PrerenderProvider>
    </HelmetProvider>
  </React.StrictMode>
)
