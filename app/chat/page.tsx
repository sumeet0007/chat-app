'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { socketManager } from '../lib/socketManager';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import { useChatHooks } from '../hooks/useChatHooks';
import { useStore } from '../store/useStore';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const store = useStore();
  const {
    query,
    setQuery,
    searchResults,
    message,
    setMessage,
    showSidebar,
    setShowSidebar,
    handleSearch,
    handleSendMessage,
    handleAddFriend,
    loadMessages
  } = useChatHooks();
  
  const { messages, friends, selectedFriend, setSelectedFriend, addMessage } = store;

  // Set sidebar visibility based on screen size
  useEffect(() => {
    const handleResize = () => {
      // Only update sidebar visibility based on width, not height changes
      // This prevents the keyboard appearance from closing the sidebar
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else if (!showSidebar) {
        // Only set to false if it's not already showing
        // This prevents the keyboard from closing an open sidebar
        setShowSidebar(false);
      }
    };

    // Set initial state
    if (window.innerWidth >= 768) {
      setShowSidebar(true);
    }

    // Store previous width to detect actual width changes
    let prevWidth = window.innerWidth;
    
    // Add event listener
    const resizeListener = () => {
      // Only respond to width changes, not height changes (which happen when keyboard appears)
      if (prevWidth !== window.innerWidth) {
        prevWidth = window.innerWidth;
        handleResize();
      }
    };
    
    window.addEventListener('resize', resizeListener);
    
    // Cleanup
    return () => window.removeEventListener('resize', resizeListener);
  }, [showSidebar]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (!selectedFriend) return;
    loadMessages(selectedFriend._id);
  }, [selectedFriend, loadMessages]);

  // Handle socket connections
  useEffect(() => {
    if (!session?.user?.email) return;

    // Initialize socket connection
    socketManager.connect(session.user.email);

    // Handle incoming messages
    socketManager.on('receive-message', (msg: { 
      to: string; 
      from: string; 
      text: string; 
      senderName?: string; 
    }) => {
      const userEmail = session?.user?.email;
      if (!userEmail) return;

      if (msg.to === userEmail && selectedFriend && 
          (msg.from === selectedFriend.email || msg.from === selectedFriend._id)) {
        addMessage({
          _id: Date.now().toString(),
          from: msg.from,
          to: msg.to,
          text: msg.text,
          timestamp: new Date()
        });
      }
    });

    // Cleanup on unmount
    return () => {
      socketManager.disconnect();
    };
  }, [session, selectedFriend, addMessage]);

  if (!session) return null;

  return (
    <div className="flex h-[calc(100vh-48px)] md:h-[calc(100vh-56px)] bg-[#36393f] overflow-hidden">
      {/* Sidebar - fixed position on mobile */}
      <aside 
        className={`${
          showSidebar ? 'fixed inset-0 z-20' : 'hidden'
        } md:static md:block md:w-80 h-full overflow-hidden`}
      >
        <Sidebar
          friends={friends}
          results={searchResults}
          query={query}
          setQuery={setQuery}
          search={handleSearch}
          addFriend={handleAddFriend}
          setSelectedFriend={setSelectedFriend}
          setShowSidebar={setShowSidebar}
        />
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatArea
          selectedFriend={selectedFriend}
          messages={messages.map(m => {
            const userEmail = session?.user?.email;
            return `${m.from === userEmail ? 'You' : 'Friend'}: ${m.text}`;
          })}
          sendMessage={handleSendMessage}
          message={message}
          setMessage={setMessage}
          setShowSidebar={setShowSidebar}
        />
      </main>
    </div>
  );
}