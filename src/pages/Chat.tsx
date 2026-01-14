import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { logout, initializeAuth } from "../store/slices/authSlice";
import { setActiveChannel } from "../store/slices/chatSlice";
import { toggleTheme } from "../store/slices/themeSlice";
import { applyThemeToDOM } from "../utils/theme";
import { useChannels } from "../hooks/usePubNubObjects";
import { usePresence } from "../hooks/usePresence";
import ChannelList from "../components/ChannelList";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import TypingIndicator from "../components/TypingIndicator";
import PresenceIndicator from "../components/PresenceIndicator";

const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const activeChannel = useSelector(
    (state: RootState) => state.chat.activeChannel
  );
  const { channels, loading: channelsLoading } = useChannels();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  
  useEffect(() => {
    // Sync theme with DOM
    applyThemeToDOM(isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    // Set default channel if none is selected and channels are loaded
    if (!activeChannel && !channelsLoading && channels.length > 0) {
      dispatch(setActiveChannel(channels[0].id));
    }
  }, [activeChannel, channels, channelsLoading, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SC</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Simple Chat
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">{currentUser.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col shadow-sm">
          <ChannelList channels={channels} />
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {activeChannel ? (
            <>
              <ChatHeader channel={activeChannel} />
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-slate-50/50 dark:from-gray-900 dark:to-gray-800">
                <MessageList channel={activeChannel} />
                <TypingIndicator channel={activeChannel} />
              </div>
              <MessageInput channel={activeChannel} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-800/30">
              <div className="text-center p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 max-w-md">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Welcome to Simple Chat
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create a channel to start chatting with others
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click the <span className="font-semibold text-indigo-600 dark:text-indigo-400">+</span> button in the sidebar to create your first channel
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const ChatHeader = ({ channel }: { channel: string }) => {
  usePresence(channel);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">#{channel}</h2>
          <PresenceIndicator channel={channel} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
