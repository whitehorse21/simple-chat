import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Channel {
  id: string
  name: string
  description?: string
  custom?: Record<string, any>
}

export interface UserMetadata {
  id: string
  name: string
  email: string
  profileUrl?: string
  custom?: Record<string, any>
}

interface UserState {
  channels: Channel[]
  users: Record<string, UserMetadata>
  currentUserChannels: string[]
}

const initialState: UserState = {
  channels: [],
  users: {},
  currentUserChannels: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setChannels: (state, action: PayloadAction<Channel[]>) => {
      state.channels = action.payload
    },
    addChannel: (state, action: PayloadAction<Channel>) => {
      const exists = state.channels.find((c) => c.id === action.payload.id)
      if (!exists) {
        state.channels.push(action.payload)
      }
    },
    setUsers: (state, action: PayloadAction<Record<string, UserMetadata>>) => {
      state.users = { ...state.users, ...action.payload }
    },
    addUser: (state, action: PayloadAction<UserMetadata>) => {
      state.users[action.payload.id] = action.payload
    },
    setCurrentUserChannels: (state, action: PayloadAction<string[]>) => {
      state.currentUserChannels = action.payload
    },
  },
})

export const { setChannels, addChannel, setUsers, addUser, setCurrentUserChannels } = userSlice.actions
export default userSlice.reducer
