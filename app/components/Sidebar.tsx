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
  return (
    <div className="w-full h-full bg-white p-4 border-r overflow-y-auto max-h-[calc(100vh-64px)]">
      <div className="mb-6">
        <input
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="Search by email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={search}
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-2">Search Results</h2>
      <ul className="space-y-2 mb-6">
        {results.map((user) => (
          <li
            key={user._id}
            className="flex justify-between items-center text-sm border px-3 py-2 rounded-md bg-gray-100 text-gray-800"
          >
            <span className="truncate mr-2">{user.email}</span>
            <button
              onClick={() => addFriend(user.email)}
              className="text-green-600 hover:underline flex-shrink-0"
            >
              Add
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Friends</h2>
      <ul className="space-y-2">
        {friends.length === 0 && <p className="text-gray-600 text-sm">No friends yet</p>}
        {friends.map((friend) => (
          <li
            key={friend._id}
            className="flex justify-between items-center text-sm border px-3 py-2 rounded-md bg-gray-100 text-gray-800"
          >
            <span className="truncate mr-2">{friend.email}</span>
            <button
              onClick={() => {
                setSelectedFriend(friend);
                setShowSidebar(false);
              }}
              className="text-blue-600 hover:underline flex-shrink-0"
            >
              Chat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}