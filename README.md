# Simple Chat - PubNub Chat Application

A real-time chat application built with React, TypeScript, Tailwind CSS, and Redux, powered by PubNub.

## Features

- **Authentication**: Login, Signup, and Forgot Password pages
- **User and Channel Metadata**: PubNub Objects storage integration with custom hooks
- **Subscriptions**: Automatic subscription to user channels
- **Messages**: Real-time message publishing and display with message history
- **Presence**: Active user tracking and state observation
- **Typing Indicators**: Real-time typing notifications
- **Message Reactions**: Add emoji reactions to messages

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PubNub account with Publish and Subscribe keys

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd simple-chat
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_PUBNUB_PUBLISH_KEY=your_publish_key
VITE_PUBNUB_SUBSCRIBE_KEY=your_subscribe_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # React components
│   ├── ChannelList.tsx
│   ├── MessageInput.tsx
│   ├── MessageItem.tsx
│   ├── MessageList.tsx
│   ├── PresenceIndicator.tsx
│   └── TypingIndicator.tsx
├── context/            # React context providers
│   └── PubNubContext.tsx
├── hooks/              # Custom React hooks
│   ├── useMessages.ts
│   ├── usePresence.ts
│   ├── usePubNubObjects.ts
│   ├── useReactions.ts
│   └── useTypingIndicator.ts
├── pages/              # Page components
│   ├── Chat.tsx
│   ├── ForgotPassword.tsx
│   ├── Login.tsx
│   └── Signup.tsx
├── store/              # Redux store
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── chatSlice.ts
│   │   └── userSlice.ts
│   └── store.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Usage

### Authentication

The app includes a simple authentication flow. For demo purposes, any email/password combination will work. In production, you should integrate with a proper authentication service.

### Chat Features

1. **Channels**: Create and switch between channels using the sidebar
2. **Messages**: Type and send messages in real-time
3. **Presence**: See who's currently active in each channel
4. **Typing Indicators**: See when others are typing
5. **Reactions**: Click "Add reaction" on any message to add emoji reactions

## Technologies Used

- **React 18**: UI library
- **TypeScript**: Type safety
- **Redux Toolkit**: State management
- **React Router**: Routing
- **Tailwind CSS**: Styling
- **PubNub**: Real-time messaging infrastructure
- **Vite**: Build tool and dev server

## Environment Variables

Make sure to set up your PubNub keys in the `.env` file:

- `VITE_PUBNUB_PUBLISH_KEY`: Your PubNub Publish Key
- `VITE_PUBNUB_SUBSCRIBE_KEY`: Your PubNub Subscribe Key

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## License

MIT
