import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import chatReducer from './slices/chatSlice'
import userReducer from './slices/userSlice'
import themeReducer from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    user: userReducer,
    theme: themeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
