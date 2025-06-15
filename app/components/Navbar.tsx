'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  
  return (
    <nav className="bg-[#36393f] text-white p-2 md:p-3 shadow-md sticky top-0 z-10 border-b border-[#26282c]">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg md:text-xl font-bold flex items-center">
          <svg width="24" height="18" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M23.7188 1.67676C21.9242 0.87207 20.0273 0.287109 18.0566 0C17.8232 0.421875 17.5605 0.990234 17.3711 1.44531C15.2832 1.18066 13.2246 1.18066 11.1953 1.44531C11.0059 0.990234 10.7344 0.421875 10.498 0C8.52344 0.287109 6.62402 0.873047 4.82812 1.67969C1.39453 6.8457 0.458984 11.8945 0.925781 16.8701C3.2793 18.6309 5.55664 19.6875 7.79688 20C8.41016 19.1514 8.95508 18.2471 9.42188 17.2969C8.52344 16.9678 7.66992 16.5537 6.86523 16.0674C7.05469 15.9268 7.24023 15.7773 7.41992 15.6221C12.3516 17.9199 17.7012 17.9199 22.5801 15.6221C22.7598 15.7773 22.9453 15.9268 23.1348 16.0674C22.3301 16.5537 21.4766 16.9678 20.5781 17.2969C21.0449 18.2471 21.5898 19.1514 22.2031 20C24.4434 19.6875 26.7207 18.6309 29.0742 16.8701C29.6211 11.1016 28.1836 6.09961 24.7188 1.67676H23.7188ZM9.76562 13.8574C8.32031 13.8574 7.13867 12.5342 7.13867 10.9375C7.13867 9.3418 8.29297 8.01758 9.76562 8.01758C11.2383 8.01758 12.4199 9.3418 12.3926 10.9375C12.3926 12.5342 11.2383 13.8574 9.76562 13.8574ZM18.7344 13.8574C17.2891 13.8574 16.1074 12.5342 16.1074 10.9375C16.1074 9.3418 17.2617 8.01758 18.7344 8.01758C20.207 8.01758 21.3887 9.3418 21.3613 10.9375C21.3613 12.5342 20.207 13.8574 18.7344 13.8574Z" fill="#7289DA"/>
          </svg>
          <span className="hidden sm:inline">Discord Clone</span>
        </Link>
        
        {session?.user && (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-0 sm:space-x-2 bg-[#2f3136] hover:bg-[#40444b] py-1 px-2 md:py-2 md:px-4 rounded-md transition"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#7289da] flex items-center justify-center text-white font-medium">
                {session.user.name ? session.user.name[0].toUpperCase() : session.user.email?.[0].toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm md:text-base">{session.user.name || session.user.email}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#18191c] text-[#dcddde] rounded-md shadow-lg py-1 z-10 border border-[#26282c]">
                <Link href="/profile" className="block px-4 py-2 hover:bg-[#2f3136] text-sm">
                  Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 hover:bg-[#2f3136] text-sm">
                  Settings
                </Link>
                <Link href="/api/auth/signout" className="block px-4 py-2 hover:bg-[#2f3136] text-[#ed4245] text-sm">
                  Sign out
                </Link>
              </div>
            )}
          </div>
        )}
        
        {!session?.user && (
          <Link href="/api/auth/signin" className="bg-[#7289da] hover:bg-[#677bc4] py-1 px-3 md:py-2 md:px-4 rounded-md transition text-sm md:text-base">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}