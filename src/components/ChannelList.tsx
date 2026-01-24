import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { setActiveChannel } from '../store/slices/chatSlice'
import { useChannels, useUserChannels } from '../hooks/usePubNubObjects'
import { useState } from 'react'
import { createPortal } from 'react-dom'

const ChannelList = ({ channels }: { channels: any[] }) => {
  const dispatch = useDispatch()
  const activeChannel = useSelector((state: RootState) => state.chat.activeChannel)
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const { createChannel } = useChannels()
  const { addUserToChannel } = useUserChannels(currentUser?.id || '')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newChannelName, setNewChannelName] = useState('')

  const handleCreateChannel = async () => {
    if (newChannelName.trim()) {
      try {
        const channelId = await createChannel(newChannelName.trim())
        if (channelId) {
          // Automatically add user to the channel
          try {
            await addUserToChannel(channelId)
          } catch (err) {
            console.error('Failed to add user to channel:', err)
          }
          dispatch(setActiveChannel(channelId))
          setShowCreateModal(false)
          setNewChannelName('')
        }
      } catch (err) {
        console.error('Failed to create channel:', err)
      }
    }
  }

  const handleChannelSelect = async (channelId: string) => {
    dispatch(setActiveChannel(channelId))
    // Automatically add user to the channel if not already a member
    try {
      await addUserToChannel(channelId)
    } catch (err) {
      // User might already be a member, ignore error
      console.log('User already in channel or error:', err)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Channels</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center text-xl font-bold"
            title="Create Channel"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white/60 dark:bg-gray-800/60">
        <div className="p-3">
          {channels.length === 0 ? (
            <div className="text-gray-400 dark:text-gray-500 text-sm p-4 text-center">
              <p>No channels yet</p>
              <p className="text-xs mt-1">Create one to get started!</p>
            </div>
          ) : (
            channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => handleChannelSelect(channel.id)}
                className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                  activeChannel === channel.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2 text-lg">#</span>
                  <span className="font-medium">{channel.name}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {showCreateModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Create New Channel</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Start a new conversation channel</p>
              <input
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="e.g., general, random, support"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl mb-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateChannel()
                  }
                }}
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewChannelName('')
                  }}
                  className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateChannel}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Create Channel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export default ChannelList
