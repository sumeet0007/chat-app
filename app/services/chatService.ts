import { User, Message, APIResponse } from '../types'

class ChatService {
  async getFriends(): Promise<APIResponse<User[]>> {
    try {
      const res = await fetch('/api/get-friends')
      const data = await res.json()
      return { data, status: 200 }
    } catch (error) {
      return { error: 'Failed to fetch friends', status: 500 }
    }
  }

  async searchUsers(query: string): Promise<APIResponse<User[]>> {
    try {
      const res = await fetch(`/api/search-users?q=${query}`)
      const data = await res.json()
      return { data, status: 200 }
    } catch (error) {
      return { error: 'Failed to search users', status: 500 }
    }
  }

  async sendMessage(to: string, text: string): Promise<APIResponse<Message>> {
    try {
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, text }),
      })
      const data = await res.json()
      return { data, status: 200 }
    } catch (error) {
      return { error: 'Failed to send message', status: 500 }
    }
  }

  async getMessages(friendId: string): Promise<APIResponse<string[]>> {
    try {
      const res = await fetch(`/api/get-messages?friendId=${friendId}`)
      const data = await res.json()
      return { data, status: 200 }
    } catch (error) {
      return { error: 'Failed to fetch messages', status: 500 }
    }
  }

  async addFriend(email: string): Promise<APIResponse<void>> {
    try {
      await fetch('/api/add-friend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendEmail: email }),
      })
      return { status: 200 }
    } catch (error) {
      return { error: 'Failed to add friend', status: 500 }
    }
  }
}

export const chatService = new ChatService()