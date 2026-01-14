import { useState, FormEvent, KeyboardEvent } from 'react'
import { useMessages } from '../hooks/useMessages'
import { useTypingIndicator } from '../hooks/useTypingIndicator'

const MessageInput = ({ channel }: { channel: string }) => {
  const [message, setMessage] = useState('')
  const { sendMessage } = useMessages(channel)
  const { sendTypingIndicator } = useTypingIndicator(channel)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim() || sending) return

    setSending(true)
    try {
      await sendMessage(message.trim())
      setMessage('')
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleChange = (value: string) => {
    setMessage(value)
    if (value.trim()) {
      sendTypingIndicator()
    }
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 p-4 shadow-lg">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => handleChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-all"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || sending}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          {sending ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            'Send'
          )}
        </button>
      </form>
    </div>
  )
}

export default MessageInput
