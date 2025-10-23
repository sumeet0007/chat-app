import { useState, useCallback } from 'react'
import { useStore } from '../store/useStore'
import { chatService } from '../services/chatService'
import { Message, User } from '../types'
import { socketManager } from '../lib/socketManager'

export function useChatHooks() {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [message, setMessage] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  
  const { messages, friends, selectedFriend, addMessage, setFriends, setSelectedFriend } = useStore()

  const handleSearch = useCallback(async () => {
    const response = await chatService.searchUsers(query)
    if (response.data) {
      setSearchResults(response.data)
    }
  }, [query])

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !selectedFriend) return

    const response = await chatService.sendMessage(selectedFriend._id, message)
    if (response.data) {
      addMessage(response.data)
      socketManager.emit('send-message', {
        to: selectedFriend.email,
        text: message,
      })
      setMessage('')
    }
  }, [message, selectedFriend, addMessage])

  const handleAddFriend = useCallback(async (email: string) => {
    const response = await chatService.addFriend(email)
    if (response.status === 200) {
      const friendsResponse = await chatService.getFriends()
      if (friendsResponse.data) {
        setFriends(friendsResponse.data)
      }
    }
  }, [setFriends])

  const loadMessages = useCallback(async (friendId: string) => {
    const response = await chatService.getMessages(friendId)
    if (response.data) {
      useStore.setState({ messages: response.data as unknown as Message[] })
    }
  }, [])

  return {
    query,
    setQuery,
    searchResults,
    message,
    setMessage,
    showSidebar,
    setShowSidebar,
    messages,
    friends,
    selectedFriend,
    setSelectedFriend,
    handleSearch,
    handleSendMessage,
    handleAddFriend,
    loadMessages
  }
}