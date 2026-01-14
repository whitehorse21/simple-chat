import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { useEffect, useState } from 'react'

const PresenceIndicator = ({ channel }: { channel: string }) => {
  const presenceUsers = useSelector((state: RootState) => state.chat.presenceUsers[channel] || [])
  const [displayCount, setDisplayCount] = useState(presenceUsers.length)

  useEffect(() => {
    setDisplayCount(presenceUsers.length)
  }, [presenceUsers.length])

  return (
    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
      <div className={`w-1.5 h-1.5 rounded-full ${displayCount > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400 dark:bg-gray-600'}`}></div>
      <span>
        {displayCount > 0 
          ? `${displayCount} ${displayCount === 1 ? 'user' : 'users'} online`
          : 'No active users'}
      </span>
    </div>
  )
}

export default PresenceIndicator
