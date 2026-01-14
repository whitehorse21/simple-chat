import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { Message } from '../store/slices/chatSlice'
import { useMessages } from '../hooks/useMessages'
import MessageItem from './MessageItem'

const MessageList = ({ channel }: { channel: string }) => {
  const messages = useSelector((state: RootState) => state.chat.messages[channel] || [])
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  useMessages(channel)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Deduplicate messages by messageId
  const uniqueMessages = messages.filter((msg: Message, index: number, self: Message[]) =>
    index === self.findIndex((m: Message) => m.messageId === msg.messageId)
  )

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        {uniqueMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No messages yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {uniqueMessages.map((message: Message, index: number) => {
              const prevMessage = index > 0 ? uniqueMessages[index - 1] : null
              
              // Calculate time difference
              const timeDiff = prevMessage
                ? Math.abs(
                    new Date(parseInt(message.timetoken) / 10000).getTime() -
                    new Date(parseInt(prevMessage.timetoken) / 10000).getTime()
                  )
                : Infinity
              
              // Show timestamp if: first message or more than 5 minutes passed
              const showTimestamp = index === 0 || timeDiff > 300000

              return (
                <MessageItem
                  key={`${message.messageId}-${index}`}
                  message={message}
                  isOwn={message.senderId === currentUser?.id}
                  showTimestamp={showTimestamp}
                />
              )
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default MessageList
