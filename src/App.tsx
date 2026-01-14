import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import { useEffect } from 'react'
import { applyThemeToDOM } from './utils/theme'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Chat from './pages/Chat'
import { PubNubProvider } from './context/PubNubContext'

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode)

  useEffect(() => {
    // Ensure dark class is applied to html element
    applyThemeToDOM(isDarkMode)
  }, [isDarkMode])

  return (
    <PubNubProvider>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/chat" />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/chat" />} />
        <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/chat" />} />
        <Route path="/chat" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/chat" : "/login"} />} />
      </Routes>
    </PubNubProvider>
  )
}

export default App
