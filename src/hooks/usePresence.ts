import { useEffect, useRef } from 'react'
import { usePubNub } from '../context/PubNubContext'
import { useDispatch } from 'react-redux'
import { setPresenceUsers } from '../store/slices/chatSlice'

export const usePresence = (channel: string) => {
  const { pubnub, isReady } = usePubNub()
  const dispatch = useDispatch()
  const listenerRef = useRef<any>(null)

  useEffect(() => {
    if (!isReady || !pubnub || !channel) return

    // Subscribe to presence events for this channel
    pubnub.subscribe({ 
      channels: [channel], 
      withPresence: true 
    })
    
    // Set initial presence immediately (current user is always present)
    const currentUserId = pubnub.getUserId()
    if (currentUserId) {
      dispatch(setPresenceUsers({ channel, userIds: [currentUserId] }))
    }

    // Function to update presence
    const updatePresence = async () => {
      try {
        const response = await pubnub.hereNow({ 
          channels: [channel],
          includeUUIDs: true,
          includeState: false
        })
        const channelData = response.channels[channel]
        if (channelData) {
          // Extract userIds from occupants (use userId if available, otherwise uuid)
          const userIds = channelData.occupants?.map((occ: any) => {
            // In PubNub v8, check for userId first, then uuid
            return occ.userId || occ.uuid || ''
          }).filter((id: string) => id) || []
          
          // Always include current user if they're subscribed
          const currentUserId = pubnub.getUserId()
          if (currentUserId && !userIds.includes(currentUserId)) {
            userIds.push(currentUserId)
          }
          
          dispatch(setPresenceUsers({ channel, userIds }))
        } else {
          // If no channel data, at least include current user
          const currentUserId = pubnub.getUserId()
          if (currentUserId) {
            dispatch(setPresenceUsers({ channel, userIds: [currentUserId] }))
          }
        }
      } catch (err) {
        console.error('Error fetching presence:', err)
        // On error, at least show current user
        const currentUserId = pubnub.getUserId()
        if (currentUserId) {
          dispatch(setPresenceUsers({ channel, userIds: [currentUserId] }))
        }
      }
    }

    // Listen for presence events
    const handlePresence = (event: any) => {
      if (event.channel === channel) {
        // Update presence immediately when someone joins/leaves
        updatePresence()
      }
    }

    // Remove old listener if exists
    if (listenerRef.current) {
      pubnub.removeListener(listenerRef.current)
    }

    listenerRef.current = { presence: handlePresence }
    pubnub.addListener(listenerRef.current)

    // Get initial presence
    updatePresence()

    // Set up periodic presence updates (every 30 seconds) as fallback
    const presenceInterval = setInterval(() => {
      updatePresence()
    }, 30000)

    return () => {
      clearInterval(presenceInterval)
      if (listenerRef.current) {
        pubnub.removeListener(listenerRef.current)
      }
      pubnub.unsubscribe({ channels: [channel] })
    }
  }, [pubnub, isReady, channel, dispatch])
}
