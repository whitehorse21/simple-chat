import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const TypingIndicator = ({ channel }: { channel: string }) => {
  const typingUsers = useSelector((state: RootState) =>
    state.chat.typingUsers.filter((u) => u.channel === channel)
  )

  if (typingUsers.length === 0) {
    return null
  }

  return (
    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 italic">
      {typingUsers.length === 1
        ? `${typingUsers[0].userName} is typing...`
        : typingUsers.length === 2
        ? `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing...`
        : `${typingUsers[0].userName} and ${typingUsers.length - 1} others are typing...`}
    </div>
  )
}

export default TypingIndicator
