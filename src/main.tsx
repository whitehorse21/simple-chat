import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { store } from './store/store.ts'
import { setTheme } from './store/slices/themeSlice.ts'
import { applyThemeToDOM } from './utils/theme'
import './index.css'

// Initialize theme on app load - apply immediately to prevent flash
const savedTheme = localStorage.getItem('theme')
const isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)

// Apply theme immediately before React renders
applyThemeToDOM(isDarkMode)

// Dispatch to Redux store
store.dispatch(setTheme(isDarkMode))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
