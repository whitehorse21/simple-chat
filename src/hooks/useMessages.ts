import { useEffect, useCallback } from 'react'
import { usePubNub } from '../context/PubNubContext'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { addMessage, setMessages, Message } from '../store/slices/chatSlice'

export const useMessages = (channel: string) => {
  const { pubnub, isReady } = usePubNub()
  const dispatch = useDispatch()
  const messages = useSelector((state: RootState) => state.chat.messages[channel] || [])
  const currentUser = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    if (!isReady || !pubnub || !channel) return

    // Subscribe to channel
    pubnub.subscribe({ channels: [channel] })

    // Fetch message history
    const fetchHistory = async () => {
      try {
        const response = await pubnub.fetchMessages({
          channels: [channel],
          count: 50,
        })

        const messageList: Message[] = []
        if (response.channels[channel]) {
          response.channels[channel].forEach((msg: any) => {
            messageList.push({
              messageId: msg.timetoken,
              text: msg.message.text || msg.message,
              senderId: msg.userId || msg.uuid || msg.publisher || '',
              senderName: msg.message.senderName,
              timetoken: msg.timetoken,
              reactions: msg.message.reactions,
              channel,
            })
          })
        }
        dispatch(setMessages({ channel, messages: messageList }))
      } catch (err) {
        console.error('Error fetching message history:', err)
      }
    }

    fetchHistory()

    // Listen for new messages
    const handleMessage = (event: any) => {
      if (event.channel === channel) {
        const newMessage: Message = {
          messageId: event.timetoken,
          text: event.message.text || event.message,
          senderId: event.userId || event.publisher || event.uuid || '',
          senderName: event.message.senderName,
          timetoken: event.timetoken,
          reactions: event.message.reactions,
          channel,
        }
        dispatch(addMessage(newMessage))
      }
    }

    const listener = { message: handleMessage }
    pubnub.addListener(listener)

    return () => {
      pubnub.removeListener(listener)
      pubnub.unsubscribe({ channels: [channel] })
    }
  }, [pubnub, isReady, channel, dispatch])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!pubnub || !currentUser || !text.trim()) return

      try {
        await pubnub.publish({
          channel,
          message: {
            text,
            senderName: currentUser.name,
            senderId: currentUser.id,
          },
        })
      } catch (err) {
        console.error('Error sending message:', err)
        throw err
      }
    },
    [pubnub, channel, currentUser]
  )

  return { messages, sendMessage }
}
