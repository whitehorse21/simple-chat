import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Message {
  messageId: string
  text: string
  senderId: string
  senderName?: string
  timetoken: string
  reactions?: Record<string, string[]>
  channel?: string
}

export interface TypingIndicator {
  userId: string
  userName: string
  channel: string
}

interface ChatState {
  messages: Record<string, Message[]>
  activeChannel: string | null
  typingUsers: TypingIndicator[]
  presenceUsers: Record<string, string[]>
}

const initialState: ChatState = {
  messages: {},
  activeChannel: null,
  typingUsers: [],
  presenceUsers: {},
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChannel: (state, action: PayloadAction<string>) => {
      state.activeChannel = action.payload
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const channel = action.payload.channel || state.activeChannel || 'general'
      if (!state.messages[channel]) {
        state.messages[channel] = []
      }
      // Check if message already exists to prevent duplicates
      const exists = state.messages[channel].find(
        (msg) => msg.messageId === action.payload.messageId
      )
      if (!exists) {
        state.messages[channel].push(action.payload)
      }
    },
    setMessages: (state, action: PayloadAction<{ channel: string; messages: Message[] }>) => {
      state.messages[action.payload.channel] = action.payload.messages
    },
    addTypingUser: (state, action: PayloadAction<TypingIndicator>) => {
      const exists = state.typingUsers.find(
        (u) => u.userId === action.payload.userId && u.channel === action.payload.channel
      )
      if (!exists) {
        state.typingUsers.push(action.payload)
      }
    },
    removeTypingUser: (state, action: PayloadAction<{ userId: string; channel: string }>) => {
      state.typingUsers = state.typingUsers.filter(
        (u) => !(u.userId === action.payload.userId && u.channel === action.payload.channel)
      )
    },
    setPresenceUsers: (state, action: PayloadAction<{ channel: string; userIds: string[] }>) => {
      state.presenceUsers[action.payload.channel] = action.payload.userIds
    },
    addReaction: (
      state,
      action: PayloadAction<{ channel: string; messageId: string; userId: string; emoji: string }>
    ) => {
      const channel = action.payload.channel || state.activeChannel || 'general'
      const messages = state.messages[channel] || []
      const message = messages.find((m) => m.messageId === action.payload.messageId)
      if (message) {
        if (!message.reactions) {
          message.reactions = {}
        }
        if (!message.reactions[action.payload.emoji]) {
          message.reactions[action.payload.emoji] = []
        }
        if (!message.reactions[action.payload.emoji].includes(action.payload.userId)) {
          message.reactions[action.payload.emoji].push(action.payload.userId)
        }
      }
    },
    removeReaction: (
      state,
      action: PayloadAction<{ channel: string; messageId: string; userId: string; emoji: string }>
    ) => {
      const channel = action.payload.channel || state.activeChannel || 'general'
      const messages = state.messages[channel] || []
      const message = messages.find((m) => m.messageId === action.payload.messageId)
      if (message && message.reactions && message.reactions[action.payload.emoji]) {
        message.reactions[action.payload.emoji] = message.reactions[action.payload.emoji].filter(
          (id) => id !== action.payload.userId
        )
        if (message.reactions[action.payload.emoji].length === 0) {
          delete message.reactions[action.payload.emoji]
        }
      }
    },
  },
})

export const {
  setActiveChannel,
  addMessage,
  setMessages,
  addTypingUser,
  removeTypingUser,
  setPresenceUsers,
  addReaction,
  removeReaction,
} = chatSlice.actions
export default chatSlice.reducer
