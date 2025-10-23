import { create } from 'zustand';

interface User {
  _id: string;
  email: string;
  name?: string;
}

interface Message {
  _id: string;
  from: string;
  to: string;
  text: string;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  friends: User[];
  selectedFriend: User | null;
  addMessage: (message: Message) => void;
  setFriends: (friends: User[]) => void;
  setSelectedFriend: (friend: User | null) => void;
}

export const useStore = create<ChatState>((set: (fn: (state: ChatState) => ChatState) => void) => ({
  messages: [],
  friends: [],
  selectedFriend: null,
  addMessage: (message: Message) => 
    set((state: ChatState) => ({ ...state, messages: [...state.messages, message] })),
  setFriends: (friends: User[]) => 
    set((state: ChatState) => ({ ...state, friends })),
  setSelectedFriend: (friend: User | null) => 
    set((state: ChatState) => ({ ...state, selectedFriend: friend }))
}));