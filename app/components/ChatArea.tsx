'use client';

import { useState, useEffect, useRef } from 'react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Effect to scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  if (!selectedFriend) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#8e9297] p-4">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#36393f] flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 className="text-lg md:text-xl font-medium text-[#dcddde] mb-2 text-center">Welcome to Discord Clone</h2>
        <p className="text-[#8e9297] text-center max-w-md text-sm md:text-base">
          Select a friend from the sidebar to start chatting or search for new friends to connect with.
        </p>
        <button 
          className="mt-4 md:hidden bg-[#5865f2] text-white py-2 px-4 rounded-md"
          onClick={() => setShowSidebar(true)}
        >
          Open Contacts
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="bg-[#36393f] border-b border-[#26282c] p-3 flex items-center">
        <button 
          className="md:hidden mr-3 text-[#b9bbbe] hover:text-[#dcddde]"
          onClick={() => setShowSidebar(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#b9bbbe] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        
        <div className="overflow-hidden">
          <h2 className="font-medium text-[#ffffff] truncate text-sm md:text-base">{selectedFriend.email}</h2>
          <p className="text-xs text-[#b9bbbe]">Online</p>
        </div>
        
        <div className="ml-auto flex space-x-1 md:space-x-3 text-[#b9bbbe]">
          <button className="hover:text-[#dcddde] hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="hover:text-[#dcddde]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="hover:text-[#dcddde]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-[#36393f] p-3 md:p-4 space-y-3 md:space-y-4" id="chat-messages">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-[#8e9297] py-6 md:py-8">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#5865f2] flex items-center justify-center mb-4">
              <span className="text-white text-lg md:text-xl font-bold">{selectedFriend.email[0].toUpperCase()}</span>
            </div>
            <h3 className="text-base md:text-lg font-medium text-[#dcddde] mb-1">
              {selectedFriend.email}
            </h3>
            <p className="text-xs md:text-sm text-[#8e9297] text-center px-4">
              This is the beginning of your direct message history with {selectedFriend.email.split('@')[0]}.
            </p>
          </div>
        )}
        
        {messages.map((msg, i) => {
          const isYou = msg.startsWith('You:');
          const content = isYou ? msg.substring(4) : msg;
          const name = isYou ? 'You' : msg.split(':')[0];
          const messageContent = isYou ? content : msg.substring(name.length + 1);
          
          return (
            <div key={i} className="flex group hover:bg-[#32353b] px-2 py-1 rounded">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#5865f2] flex items-center justify-center text-white mr-2 md:mr-3 flex-shrink-0">
                {name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap">
                  <span className={`font-medium text-sm md:text-base ${isYou ? 'text-[#3ba55c]' : 'text-[#ed4245]'}`}>
                    {name}
                  </span>
                  <span className="text-xs text-[#72767d] ml-2">today at {new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, '0')}</span>
                </div>
                <p className="text-[#dcddde] text-sm md:text-base break-words">{messageContent}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex items-center text-[#b9bbbe] hidden md:flex">
                <button className="p-1 hover:text-[#dcddde]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button className="p-1 hover:text-[#dcddde]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </button>
                <button className="p-1 hover:text-[#dcddde]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-3 md:p-4 bg-[#36393f]">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }} 
          className="flex items-center bg-[#40444b] rounded-lg p-1"
        >
          <button type="button" className="p-1 md:p-2 text-[#b9bbbe] hover:text-[#dcddde]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          
          <input
            className="flex-1 bg-transparent px-2 md:px-3 py-2 focus:outline-none text-[#dcddde] placeholder-[#72767d] text-sm md:text-base"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message @${selectedFriend.email.split('@')[0]}`}
          />
          
          <button type="button" className="p-1 md:p-2 text-[#b9bbbe] hover:text-[#dcddde] hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <button type="button" className="p-1 md:p-2 text-[#b9bbbe] hover:text-[#dcddde] hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          <button type="submit" className="p-1 md:p-2 text-[#b9bbbe] hover:text-[#dcddde]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}