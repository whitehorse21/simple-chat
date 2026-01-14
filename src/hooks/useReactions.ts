import { useCallback, useEffect } from 'react'
import { usePubNub } from '../context/PubNubContext'
import { useDispatch, useSelector } from 'react-redux'
import { addReaction, removeReaction } from '../store/slices/chatSlice'
import { RootState } from '../store/store'

export const useReactions = (channel: string) => {
  const { pubnub, isReady } = usePubNub()
  const dispatch = useDispatch()
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const messages = useSelector((state: RootState) => state.chat.messages[channel] || [])

  useEffect(() => {
    if (!isReady || !pubnub || !channel) return

    const reactionChannel = `${channel}-reactions`
    pubnub.subscribe({ channels: [reactionChannel] })

    const handleReaction = (event: any) => {
      if (event.channel === reactionChannel && event.message.type === 'reaction') {
        const { messageId, emoji, action, userId, reactions } = event.message

        if (action === 'add') {
          dispatch(addReaction({ channel, messageId, userId, emoji }))
        } else if (action === 'remove') {
          dispatch(removeReaction({ channel, messageId, userId, emoji }))
        }
      }
    }

    const listener = { message: handleReaction }
    pubnub.addListener(listener)

    return () => {
      pubnub.removeListener(listener)
      pubnub.unsubscribe({ channels: [reactionChannel] })
    }
  }, [pubnub, isReady, channel, dispatch])

  const toggleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!pubnub || !currentUser || !isReady) return

      try {
        // Find the message in local state
        const message = messages.find((m) => m.messageId === messageId)
        const reactions = message?.reactions || {}

        const hasReaction = reactions[emoji]?.includes(currentUser.id)

        if (hasReaction) {
          // Remove reaction
          const updatedReactions = { ...reactions }
          updatedReactions[emoji] = updatedReactions[emoji].filter((id: string) => id !== currentUser.id)
          if (updatedReactions[emoji].length === 0) {
            delete updatedReactions[emoji]
          }

          await pubnub.publish({
            channel: `${channel}-reactions`,
            message: {
              type: 'reaction',
              messageId,
              emoji,
              action: 'remove',
              userId: currentUser.id,
              reactions: updatedReactions,
            },
          })

          dispatch(removeReaction({ channel, messageId, userId: currentUser.id, emoji }))
        } else {
          // Add reaction
          const updatedReactions = { ...reactions }
          if (!updatedReactions[emoji]) {
            updatedReactions[emoji] = []
          }
          updatedReactions[emoji].push(currentUser.id)

          await pubnub.publish({
            channel: `${channel}-reactions`,
            message: {
              type: 'reaction',
              messageId,
              emoji,
              action: 'add',
              userId: currentUser.id,
              reactions: updatedReactions,
            },
          })

          dispatch(addReaction({ channel, messageId, userId: currentUser.id, emoji }))
        }
      } catch (err) {
        console.error('Error toggling reaction:', err)
      }
    },
    [pubnub, channel, currentUser, isReady, dispatch, messages]
  )

  return { toggleReaction }
}
