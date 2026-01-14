import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { Message } from '../store/slices/chatSlice'
import { useUserMetadata } from '../hooks/usePubNubObjects'
import { useReactions } from '../hooks/useReactions'
import { format } from 'date-fns'
import { useState } from 'react'

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏']

interface MessageItemProps {
  message: Message
  isOwn: boolean
  showAvatar: boolean
  showTimestamp: boolean
}

const MessageItem = ({ message, isOwn, showAvatar, showTimestamp }: MessageItemProps) => {
  const { user } = useUserMetadata(message.senderId)
  const { toggleReaction } = useReactions(message.channel || 'general')
  const [showReactions, setShowReactions] = useState(false)
  const currentUser = useSelector((state: RootState) => state.auth.user)

  const timestamp = new Date(parseInt(message.timetoken) / 10000)
  const senderName = user?.name || message.senderName || message.senderId

  return (
    <div className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} group mb-4`}>
      <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} gap-3 max-w-[75%]`}>
        {!isOwn && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-md self-end">
            {senderName.charAt(0).toUpperCase()}
          </div>
        )}
        {isOwn && <div className="w-10 flex-shrink-0" />}

        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          {showTimestamp && (
            <div className={`text-xs text-gray-400 dark:text-gray-500 mb-1 px-2 font-medium w-full ${isOwn ? 'text-right' : 'text-left'}`}>
              {format(timestamp, 'MMM d, h:mm a')}
            </div>
          )}
          {!isOwn && (
            <div className="text-xs text-gray-600 dark:text-gray-300 mb-1 px-2 font-semibold">{senderName}</div>
          )}

          <div
            className={`relative px-4 py-3 rounded-2xl shadow-md transition-all duration-200 ${
              isOwn
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-gray-700'
            }`}
          >
            <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>

            {/* Reactions */}
            {message.reactions && Object.keys(message.reactions).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {Object.entries(message.reactions).map(([emoji, userIds]) => (
                  <button
                    key={emoji}
                    onClick={() => toggleReaction(message.messageId, emoji)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      userIds.includes(currentUser?.id || '')
                        ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-sm">{emoji}</span> <span className="ml-1 font-medium">{userIds.length}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Reaction picker */}
            {showReactions && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-3 flex gap-2 border border-gray-200 dark:border-gray-700 z-10">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      toggleReaction(message.messageId, emoji)
                      setShowReactions(false)
                    }}
                    className="text-2xl hover:scale-125 transition-transform p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reaction button */}
          <button
            onClick={() => setShowReactions(!showReactions)}
            className={`text-xs text-gray-400 dark:text-gray-500 mt-1 px-2 opacity-0 group-hover:opacity-100 transition-all hover:text-indigo-600 dark:hover:text-indigo-400 ${
              isOwn ? 'text-right' : 'text-left'
            }`}
          >
            Add reaction
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageItem
