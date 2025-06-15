'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Chat App</Link>
        
        {session?.user && (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 py-2 px-4 rounded-md transition"
            >
              <span>{session.user.name || session.user.email}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">
                  Settings
                </Link>
                <Link href="/api/auth/signout" className="block px-4 py-2 hover:bg-gray-100 text-red-600">
                  Sign out
                </Link>
              </div>
            )}
          </div>
        )}
        
        {!session?.user && (
          <Link href="/api/auth/signin" className="bg-blue-700 hover:bg-blue-800 py-2 px-4 rounded-md transition">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}