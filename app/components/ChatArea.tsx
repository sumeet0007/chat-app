'use client';

import { useState, useEffect } from 'react';

type Friend = {
  _id: string;
  email: string;
};

type ChatAreaProps = {
  selectedFriend: Friend | null;
  messages: string[];
  sendMessage: () => void;
  message: string;
  setMessage: (message: string) => void;
  setShowSidebar: (show: boolean) => void;
};

export default function ChatArea({
  selectedFriend,
  messages,
  sendMessage,
  message,
  setMessage,
  setShowSidebar
}: ChatAreaProps) {
  // Scroll to bottom of messages when messages change
  const scrollToBottom = () => {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };
  
  // Effect to scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);
  if (!selectedFriend) {
    return (
      <div className="m-auto text-gray-500 text-base md:text-xl">
        Select a friend to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
        <button 
          className="md:hidden mr-2 text-blue-600"
          onClick={() => setShowSidebar(true)}
        >
          ←
        </button>
        <span className="truncate">Chat with {selectedFriend.email}</span>
      </div>

      <div className="flex-1 overflow-y-auto bg-white border rounded-md p-3 md:p-4 shadow-sm mb-4 space-y-2 max-h-[calc(100vh-264px)]" id="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className="bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm md:text-base">
            {msg}
          </div>
        ))}
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }} className="flex gap-2">
        <input
          className="flex-1 border px-3 md:px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 text-sm md:text-base"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-3 md:px-5 py-2 rounded-md hover:bg-green-600 transition text-sm md:text-base"
        >
          Send
        </button>
      </form>
    </div>
  );
}