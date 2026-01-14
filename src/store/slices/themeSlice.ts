import { createSlice } from '@reduxjs/toolkit'
import { applyThemeToDOM } from '../../utils/theme'

interface ThemeState {
  isDarkMode: boolean
}

const getInitialTheme = (): boolean => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme')
    if (saved) {
      return saved === 'dark'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

const initialState: ThemeState = {
  isDarkMode: getInitialTheme(),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newDarkMode = !state.isDarkMode
      state.isDarkMode = newDarkMode
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
      applyThemeToDOM(newDarkMode)
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload
      localStorage.setItem('theme', action.payload ? 'dark' : 'light')
      applyThemeToDOM(action.payload)
    },
  },
})

// Apply initial theme immediately if DOM is available
if (typeof window !== 'undefined' && document.documentElement) {
  applyThemeToDOM(initialState.isDarkMode)
}

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
