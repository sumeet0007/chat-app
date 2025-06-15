'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import socket from '../lib/socket';

export default function FriendSearch() {
  const { data: session, status } = useSession() as any;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/api/auth/signin');
  }, [status]);

  useEffect(() => {
    if (!selectedFriend) return;

    const fetchMessages = async () => {
      const res = await fetch(`/api/get-messages?friendId=${selectedFriend._id}`);
      const data = await res.json();
      setMessages(data);
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
      to: selectedFriend.email, // Use email instead of _id for recipient
      text: message,
      senderName: session?.user?.name || session?.user?.email
    };

    console.log("Sending message via socket:", messageData);

    if (!socket.connected) {
      socket.connect();
      socket.emit('join-room', userId);
    }

    socket.emit('send-message', messageData);

    // Update local messages state
    setMessages((prev) => [...prev, `You: ${message}`]);
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

  const openChat = (friendId: string) => {
    router.push(`/chat/${friendId}`);
  };

  const [receiverId, setReceiverId] = useState(''); // friend user ID

  // Property 'id' does not exist on type '{ name?: string | null | undefined; email?: string | null | undefined; image?: string | null | undefined; }'.
  // Using 'email' instead as it's a common unique identifier for users.
  // Use email as userId if id is not available
  const userId = session?.user?.id || session?.user?.email;

  useEffect(() => {
    if (!session?.user) return;

    // Always use email for socket connections
    const userEmail = session.user.email;

    socket.connect();

    // Ensure we're connected before emitting events
    socket.on('connect', () => {
      console.log("Socket connected with ID:", socket.id);
      socket.emit('join-room', userEmail);
    });

    socket.off('receive-message'); // clean before attaching
    socket.on('receive-message', (msg) => {
      console.log("Received message:", msg);

      // Show messages from the selected friend to current user
      if (msg.to === userEmail &&
        (msg.from === selectedFriend?.email || msg.from === selectedFriend?._id)) {
        const senderName = msg.senderName || 'Friend';
        setMessages((prev) => [...prev, `${senderName}: ${msg.text}`]);
      }

      // Show messages from current user to selected friend (echo)
      else if (msg.from === userEmail &&
        (msg.to === selectedFriend?.email || msg.to === selectedFriend?._id)) {
        // This handles our own messages coming back from the server
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [session, selectedFriend]);

  if (!session) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden bg-blue-600 text-white py-2 px-4 m-2 rounded-md"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? 'Hide Contacts' : 'Show Contacts'}
      </button>

      {/* Sidebar */}
      <aside className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-1/4 bg-white p-4 border-r overflow-y-auto`}>
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
          {results.map((user: any) => (
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
          {friends.map((friend: any) => (
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
      </aside>

      {/* Main Chat Area */}
      <main className={`${showSidebar ? 'hidden md:flex' : 'flex'} flex-1 flex-col p-3 md:p-6`}>
        {selectedFriend ? (
          <>
            <div className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
              <button 
                className="md:hidden mr-2 text-blue-600"
                onClick={() => setShowSidebar(true)}
              >
                ←
              </button>
              <span className="truncate">Chat with {selectedFriend.email}</span>
            </div>

            <div className="flex-1 overflow-y-auto bg-white border rounded-md p-3 md:p-4 shadow-sm mb-4 space-y-2">
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
          </>
        ) : (
          <div className="m-auto text-gray-500 text-base md:text-xl">Select a friend to start chatting</div>
        )}
      </main>
    </div>
  );
}
