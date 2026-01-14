import { useEffect, useCallback, useRef } from 'react'
import { usePubNub } from '../context/PubNubContext'
import { useDispatch } from 'react-redux'
import { addTypingUser, removeTypingUser } from '../store/slices/chatSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const TYPING_TIMEOUT = 3000

export const useTypingIndicator = (channel: string) => {
  const { pubnub, isReady } = usePubNub()
  const dispatch = useDispatch()
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isReady || !pubnub || !channel) return

    // Subscribe to channel to receive signals
    pubnub.subscribe({ channels: [channel] })

    // Listen for typing indicators
    const handleSignal = (event: any) => {
      if (event.channel === channel) {
        const signalType = event.message?.type
        const publisherId = event.publisher || event.userId
        
        if (signalType === 'typing' && publisherId !== currentUser?.id) {
          dispatch(
            addTypingUser({
              userId: publisherId,
              userName: event.message.userName || publisherId,
              channel,
            })
          )

          // Remove typing indicator after timeout
          setTimeout(() => {
            dispatch(removeTypingUser({ userId: publisherId, channel }))
          }, TYPING_TIMEOUT)
        } else if (signalType === 'typing-stop' && publisherId !== currentUser?.id) {
          dispatch(removeTypingUser({ userId: publisherId, channel }))
        }
      }
    }

    const listener = { signal: handleSignal }
    pubnub.addListener(listener)

    return () => {
      pubnub.removeListener(listener)
      pubnub.unsubscribe({ channels: [channel] })
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [pubnub, isReady, channel, dispatch, currentUser])

  const sendTypingIndicator = useCallback(() => {
    if (!pubnub || !currentUser) return

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Send typing signal
    pubnub.signal({
      channel,
      message: {
        type: 'typing',
        userName: currentUser.name,
      },
    })

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      pubnub.signal({
        channel,
        message: {
          type: 'typing-stop',
          userName: currentUser.name,
        },
      })
    }, TYPING_TIMEOUT)
  }, [pubnub, channel, currentUser])

  return { sendTypingIndicator }
}
