import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: boolean
  user: {
    id: string
    name: string
    email: string
  } | null
  token: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: AuthState['user']; token: string }>) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('auth_token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem('auth_token')
      const userStr = localStorage.getItem('user')
      if (token && userStr) {
        state.isAuthenticated = true
        state.token = token
        state.user = JSON.parse(userStr)
      }
    },
  },
})

export const { login, logout, initializeAuth } = authSlice.actions
export default authSlice.reducer
