'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import socket from '../lib/socket';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';

export default function ChatPage() {
  const { data: session, status } = useSession() as any;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();

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

  // User ID from session
  const userId = session?.user?.id || session?.user?.email;

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/api/auth/signin');
  }, [status, router]);

  useEffect(() => {
    if (!selectedFriend) return;

    const fetchMessages = async () => {
      try {
        // Clear messages before fetching new ones
        setMessages([]);
        
        const res = await fetch(`/api/get-messages?friendId=${selectedFriend._id}`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    
    fetchMessages();
  }, [selectedFriend]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedFriend) return;

    // Send message to API for persistence
    await fetch('/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: selectedFriend._id, text: message }),
    });

    // Emit message through socket for real-time delivery
    const messageData = {
      from: userId,
      to: selectedFriend.email,
      text: message,
      senderName: session?.user?.name || session?.user?.email
    };

    if (!socket.connected) {
      socket.connect();
      socket.emit('join-room', userId);
    }

    socket.emit('send-message', messageData);

    // Update local messages state
    setMessages([...messages, `You: ${message}`]);
    setMessage('');
  };

  const search = async () => {
    const res = await fetch(`/api/search-users?q=${query}`);
    const users = await res.json();
    setResults(users);
  };

  const addFriend = async (email: string) => {
    await fetch('/api/add-friend', {
      method: 'POST',
      body: JSON.stringify({ friendEmail: email }),
    });
    alert(`${email} added as friend!`);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    const res = await fetch('/api/get-friends');
    const data = await res.json();
    setFriends(data);
  };

  useEffect(() => {
    if (!session?.user) return;

    const userEmail = session.user.email;
    socket.connect();

    socket.on('connect', () => {
      socket.emit('join-room', userEmail);
    });

    socket.off('receive-message');
    socket.on('receive-message', (msg) => {
      if (msg.to === userEmail &&
        (msg.from === selectedFriend?.email || msg.from === selectedFriend?._id)) {
        const senderName = msg.senderName || 'Friend';
        const newMessage = `${senderName}: ${msg.text}`;
        
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [session, selectedFriend]);

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
          results={results}
          query={query}
          setQuery={setQuery}
          search={search}
          addFriend={addFriend}
          setSelectedFriend={setSelectedFriend}
          setShowSidebar={setShowSidebar}
        />
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatArea
          selectedFriend={selectedFriend}
          messages={messages}
          sendMessage={sendMessage}
          message={message}
          setMessage={setMessage}
          setShowSidebar={setShowSidebar}
        />
      </main>
    </div>
  );
}