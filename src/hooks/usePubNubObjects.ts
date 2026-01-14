import { useEffect, useState } from 'react'
import { usePubNub } from '../context/PubNubContext'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { setChannels, addChannel, addUser, setCurrentUserChannels, Channel, UserMetadata } from '../store/slices/userSlice'

export const useChannels = () => {
  const { pubnub, isReady } = usePubNub()
  const dispatch = useDispatch()
  const channels = useSelector((state: RootState) => state.user.channels)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isReady || !pubnub) {
      setLoading(false)
      return
    }

    const fetchChannels = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await pubnub.objects.getAllChannelMetadata()
        const channelList: Channel[] = response.data.map((ch: any) => ({
          id: ch.id,
          name: ch.name || ch.id,
          description: ch.description,
          custom: ch.custom,
        }))
        dispatch(setChannels(channelList))
      } catch (err: any) {
        // If Objects API is not available (e.g., demo keys), start with empty channels
        // Users can still create channels manually
        console.warn('PubNub Objects API not available:', err.message)
        setError(null) // Don't show error, just start with empty channels
        dispatch(setChannels([]))
      } finally {
        setLoading(false)
      }
    }

    fetchChannels()
  }, [pubnub, isReady, dispatch])

  const createChannel = async (name: string, description?: string, custom?: Record<string, any>) => {
    if (!pubnub) return

    try {
      const channelId = name.toLowerCase().replace(/\s+/g, '-')
      
      // Try to create channel metadata if Objects API is available
      try {
        await pubnub.objects.setChannelMetadata({
          channel: channelId,
          data: {
            name,
            description,
            custom,
          },
        })
      } catch (objectsErr: any) {
        // If Objects API fails, still create the channel locally
        // This allows basic messaging to work even without Objects API
        console.warn('Channel metadata creation failed, creating channel locally:', objectsErr.message)
      }
      
      // Always add channel to local state
      dispatch(addChannel({ id: channelId, name, description, custom }))
      return channelId
    } catch (err: any) {
      setError(err.message || 'Failed to create channel')
      throw err
    }
  }

  return { channels, loading, error, createChannel }
}

export const useUserMetadata = (userId?: string) => {
  const { pubnub, isReady } = usePubNub()
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.user.users)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async (id: string) => {
    if (!pubnub || !isReady) return

    setLoading(true)
    setError(null)
    try {
      const response = await pubnub.objects.getUUIDMetadata({ uuid: id })
      const userData: UserMetadata = {
        id: response.data.id,
        name: response.data.name || id,
        email: response.data.email || '',
        profileUrl: response.data.profileUrl ?? undefined,
        custom: response.data.custom ?? undefined,
      }
      dispatch(addUser(userData))
      return userData
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user')
      console.error('Error fetching user:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId && !users[userId]) {
      fetchUser(userId)
    }
  }, [userId, pubnub, isReady])

  const updateUserMetadata = async (data: Partial<UserMetadata>) => {
    if (!pubnub || !userId) return

    try {
      await pubnub.objects.setUUIDMetadata({
        uuid: userId,
        data: {
          name: data.name,
          email: data.email,
          profileUrl: data.profileUrl,
          custom: data.custom,
        },
      })
      if (data.id) {
        dispatch(addUser({ ...users[userId], ...data } as UserMetadata))
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update user metadata')
      throw err
    }
  }

  return {
    user: userId ? users[userId] : null,
    loading,
    error,
    fetchUser,
    updateUserMetadata,
  }
}

export const useUserChannels = (userId: string) => {
  const { pubnub, isReady } = usePubNub()
  const dispatch = useDispatch()
  const userChannels = useSelector((state: RootState) => state.user.currentUserChannels)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isReady || !pubnub || !userId) return

    const fetchUserChannels = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await pubnub.objects.getMemberships({ uuid: userId })
        const channelIds = response.data.map((m: any) => m.channel.id)
        dispatch(setCurrentUserChannels(channelIds))
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user channels')
        console.error('Error fetching user channels:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserChannels()
  }, [pubnub, isReady, userId, dispatch])

  const addUserToChannel = async (channelId: string) => {
    if (!pubnub) return

    try {
      await pubnub.objects.setMemberships({
        uuid: userId,
        channels: [{ id: channelId }],
      })
      if (!userChannels.includes(channelId)) {
        dispatch(setCurrentUserChannels([...userChannels, channelId]))
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add user to channel')
      throw err
    }
  }

  return { userChannels, loading, error, addUserToChannel }
}
