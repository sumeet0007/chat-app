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
    <div>
      <input
        className="border p-2"
        placeholder="Search by email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={search} className="ml-2 bg-blue-500 text-white px-4 py-1 rounded">
        Search
      </button>

      <ul className="mt-4 space-y-2">
        {results.map((user: any) => (
          <li key={user._id} className="flex justify-between items-center">
            <span>{user.email}</span>
            <button onClick={() => addFriend(user.email)} className="text-green-600 font-medium">Add</button>
          </li>
        ))}
      </ul>

      <aside className="w-1/4 bg-gray-100 p-4 overflow-y-auto border-r">
        <h2 className="mt-6 font-bold">Your Friends</h2>
        <ul className="mt-2 space-y-2">
            {friends.map((friend: any) => (
            <li key={friend._id} className="flex justify-between items-center">
                <span>{friend.email}</span>
                <button
                onClick={() => setSelectedFriend(friend)}
                className="text-blue-600 font-medium"
                >
                Chat
                </button>
            </li>
            ))}
        </ul>
      </aside>
      {/* Chat box */}
      <main className="flex-1 flex flex-col p-6">
        {selectedFriend ? (
          <>
            <div className="text-xl font-semibold mb-2 border-b pb-2">
              Chat with {selectedFriend.email}
            </div>
            <div className="flex-1 overflow-y-scroll bg-gray-50 p-4 rounded border">
              {messages.map((msg, i) => (
                <div key={i} className="mb-1">
                  {msg}
                </div>
              ))}
            </div>
            <div className="mt-4 flex">
              <input
                className="flex-1 border p-2 rounded"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button
                className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500 m-auto text-xl">Select a friend to start chatting</div>
        )}
      </main>
    </div>
  );
}
