'use client';

import { useState } from 'react';

type User = {
  _id: string;
  email: string;
};

type SidebarProps = {
  friends: User[];
  results: User[];
  query: string;
  setQuery: (query: string) => void;
  search: () => void;
  addFriend: (email: string) => void;
  setSelectedFriend: (friend: User) => void;
  setShowSidebar: (show: boolean) => void;
};

export default function Sidebar({
  friends,
  results,
  query,
  setQuery,
  search,
  addFriend,
  setSelectedFriend,
  setShowSidebar
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'search'>('friends');

  return (
    <div className="w-full h-full bg-[#2f3136] flex flex-col overflow-hidden">
      {/* Server list sidebar - Discord style */}
      <div className="w-[72px] bg-[#202225] h-full fixed left-0 flex flex-col items-center pt-3 gap-3 hidden md:flex">
        {/* Home button */}
        <div className="w-12 h-12 rounded-full bg-[#36393f] flex items-center justify-center hover:rounded-2xl transition-all duration-200 cursor-pointer">
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.7188 1.67676C21.9242 0.87207 20.0273 0.287109 18.0566 0C17.8232 0.421875 17.5605 0.990234 17.3711 1.44531C15.2832 1.18066 13.2246 1.18066 11.1953 1.44531C11.0059 0.990234 10.7344 0.421875 10.498 0C8.52344 0.287109 6.62402 0.873047 4.82812 1.67969C1.39453 6.8457 0.458984 11.8945 0.925781 16.8701C3.2793 18.6309 5.55664 19.6875 7.79688 20C8.41016 19.1514 8.95508 18.2471 9.42188 17.2969C8.52344 16.9678 7.66992 16.5537 6.86523 16.0674C7.05469 15.9268 7.24023 15.7773 7.41992 15.6221C12.3516 17.9199 17.7012 17.9199 22.5801 15.6221C22.7598 15.7773 22.9453 15.9268 23.1348 16.0674C22.3301 16.5537 21.4766 16.9678 20.5781 17.2969C21.0449 18.2471 21.5898 19.1514 22.2031 20C24.4434 19.6875 26.7207 18.6309 29.0742 16.8701C29.6211 11.1016 28.1836 6.09961 24.7188 1.67676H23.7188ZM9.76562 13.8574C8.32031 13.8574 7.13867 12.5342 7.13867 10.9375C7.13867 9.3418 8.29297 8.01758 9.76562 8.01758C11.2383 8.01758 12.4199 9.3418 12.3926 10.9375C12.3926 12.5342 11.2383 13.8574 9.76562 13.8574ZM18.7344 13.8574C17.2891 13.8574 16.1074 12.5342 16.1074 10.9375C16.1074 9.3418 17.2617 8.01758 18.7344 8.01758C20.207 8.01758 21.3887 9.3418 21.3613 10.9375C21.3613 12.5342 20.207 13.8574 18.7344 13.8574Z" fill="#7289DA"/>
          </svg>
        </div>
        
        <div className="w-12 h-[2px] bg-[#36393f] rounded-full"></div>
        
        {/* Server icons - placeholders */}
        <div className="w-12 h-12 rounded-full bg-[#5865f2] flex items-center justify-center hover:rounded-2xl transition-all duration-200 cursor-pointer">
          <span className="text-white font-bold">GC</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#3ba55c] flex items-center justify-center hover:rounded-2xl transition-all duration-200 cursor-pointer">
          <span className="text-white font-bold">CH</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#ed4245] flex items-center justify-center hover:rounded-2xl transition-all duration-200 cursor-pointer">
          <span className="text-white font-bold">DM</span>
        </div>
      </div>
      
      {/* Main sidebar content */}
      <div className="md:ml-[72px] flex-1 flex flex-col h-full">
        {/* Mobile header with close button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-[#26282c]">
          <div className="flex items-center">
            <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M23.7188 1.67676C21.9242 0.87207 20.0273 0.287109 18.0566 0C17.8232 0.421875 17.5605 0.990234 17.3711 1.44531C15.2832 1.18066 13.2246 1.18066 11.1953 1.44531C11.0059 0.990234 10.7344 0.421875 10.498 0C8.52344 0.287109 6.62402 0.873047 4.82812 1.67969C1.39453 6.8457 0.458984 11.8945 0.925781 16.8701C3.2793 18.6309 5.55664 19.6875 7.79688 20C8.41016 19.1514 8.95508 18.2471 9.42188 17.2969C8.52344 16.9678 7.66992 16.5537 6.86523 16.0674C7.05469 15.9268 7.24023 15.7773 7.41992 15.6221C12.3516 17.9199 17.7012 17.9199 22.5801 15.6221C22.7598 15.7773 22.9453 15.9268 23.1348 16.0674C22.3301 16.5537 21.4766 16.9678 20.5781 17.2969C21.0449 18.2471 21.5898 19.1514 22.2031 20C24.4434 19.6875 26.7207 18.6309 29.0742 16.8701C29.6211 11.1016 28.1836 6.09961 24.7188 1.67676H23.7188ZM9.76562 13.8574C8.32031 13.8574 7.13867 12.5342 7.13867 10.9375C7.13867 9.3418 8.29297 8.01758 9.76562 8.01758C11.2383 8.01758 12.4199 9.3418 12.3926 10.9375C12.3926 12.5342 11.2383 13.8574 9.76562 13.8574ZM18.7344 13.8574C17.2891 13.8574 16.1074 12.5342 16.1074 10.9375C16.1074 9.3418 17.2617 8.01758 18.7344 8.01758C20.207 8.01758 21.3887 9.3418 21.3613 10.9375C21.3613 12.5342 20.207 13.8574 18.7344 13.8574Z" fill="#7289DA"/>
            </svg>
            <span className="text-white font-bold">Discord Clone</span>
          </div>
          <button 
            onClick={() => setShowSidebar(false)}
            className="text-[#b9bbbe] hover:text-[#dcddde]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Search bar */}
        <div className="p-4 border-b border-[#26282c]">
          <div className="bg-[#202225] rounded-md p-1 flex items-center">
            <input
              className="w-full bg-transparent px-2 py-1 focus:outline-none text-[#dcddde] placeholder-[#72767d]"
              placeholder="Find or start a conversation"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={search}
              className="p-1 text-[#72767d] hover:text-[#dcddde]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-[#26282c] text-sm">
          <button 
            className={`flex-1 py-2 px-4 ${activeTab === 'friends' ? 'bg-[#393c43] text-white' : 'text-[#8e9297] hover:bg-[#34373c] hover:text-[#dcddde]'}`}
            onClick={() => setActiveTab('friends')}
          >
            Friends
          </button>
          <button 
            className={`flex-1 py-2 px-4 ${activeTab === 'search' ? 'bg-[#393c43] text-white' : 'text-[#8e9297] hover:bg-[#34373c] hover:text-[#dcddde]'}`}
            onClick={() => setActiveTab('search')}
          >
            Search
          </button>
        </div>
        
        {/* Content based on active tab */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'friends' && (
            <div>
              <h2 className="text-[#8e9297] uppercase text-xs font-bold mb-2 tracking-wider">Direct Messages</h2>
              <ul className="space-y-1">
                {friends.length === 0 && <p className="text-[#72767d] text-sm py-2">No friends yet</p>}
                {friends.map((friend) => (
                  <li
                    key={friend._id}
                    onClick={() => {
                      setSelectedFriend(friend);
                      setShowSidebar(false);
                    }}
                    className="flex items-center p-2 rounded hover:bg-[#393c43] cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white mr-3">
                      {friend.email[0].toUpperCase()}
                    </div>
                    <span className="text-[#dcddde] truncate">{friend.email}</span>
                    <span className="ml-auto text-[#72767d] opacity-0 group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {activeTab === 'search' && (
            <div>
              <h2 className="text-[#8e9297] uppercase text-xs font-bold mb-2 tracking-wider">Search Results</h2>
              <ul className="space-y-1">
                {results.length === 0 && query && <p className="text-[#72767d] text-sm py-2">No results found</p>}
                {results.length === 0 && !query && <p className="text-[#72767d] text-sm py-2">Type to search users</p>}
                {results.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center p-2 rounded hover:bg-[#393c43] cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white mr-3">
                      {user.email[0].toUpperCase()}
                    </div>
                    <span className="text-[#dcddde] truncate">{user.email}</span>
                    <button
                      onClick={() => addFriend(user.email)}
                      className="ml-auto text-[#3ba55c] hover:text-[#43b581] opacity-0 group-hover:opacity-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* User profile section */}
        <div className="p-2 bg-[#292b2f] flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white mr-2">
            <span className="font-medium">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">User</div>
            <div className="text-xs text-[#b9bbbe] truncate">#0000</div>
          </div>
          <div className="flex space-x-1 text-[#b9bbbe]">
            <button className="p-1 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button className="p-1 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}