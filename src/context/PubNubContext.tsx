/// <reference types="vite/client" />
import React, { createContext, useContext, useEffect, useState } from 'react'
import PubNub from 'pubnub'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

interface PubNubContextType {
  pubnub: PubNub | null
  isReady: boolean
}

const PubNubContext = createContext<PubNubContextType>({ pubnub: null, isReady: false })

export const usePubNub = () => useContext(PubNubContext)

export const PubNubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pubnub, setPubnub] = useState<PubNub | null>(null)
  const [isReady, setIsReady] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize PubNub with your credentials
      // Replace with your actual PubNub keys
      const pubnubInstance = new PubNub({
        publishKey: import.meta.env.VITE_PUBNUB_PUBLISH_KEY || 'demo',
        subscribeKey: import.meta.env.VITE_PUBNUB_SUBSCRIBE_KEY || 'demo',
        userId: user.id,
      })

      setPubnub(pubnubInstance)
      setIsReady(true)
    } else {
      setPubnub(null)
      setIsReady(false)
    }
  }, [isAuthenticated, user])

  return <PubNubContext.Provider value={{ pubnub, isReady }}>{children}</PubNubContext.Provider>
}
