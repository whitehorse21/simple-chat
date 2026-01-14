// Utility function to apply theme consistently
export const applyThemeToDOM = (isDark: boolean) => {
  if (typeof document === 'undefined') return
  
  const html = document.documentElement
  
  if (isDark) {
    html.classList.add('dark')
    // Ensure it's actually added
    if (!html.classList.contains('dark')) {
      html.setAttribute('class', html.className + ' dark')
    }
  } else {
    html.classList.remove('dark')
  }
  
  // Debug log (remove in production)
  if (import.meta.env.DEV) {
    console.log(`Theme applied: ${isDark ? 'dark' : 'light'}, HTML classes:`, html.className)
  }
}
