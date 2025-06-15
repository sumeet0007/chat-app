'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <p>Loading...</p>;

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="p-8 bg-white rounded-2xl shadow-lg w-96 space-y-6 transform hover:scale-105 transition-transform duration-200">
          <h1 className="text-2xl font-bold text-gray-800">Welcome</h1>
          <p className="text-gray-600 text-lg">Please sign in to continue</p>
          <button
            onClick={() => signIn()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="w-full bg-white text-blue-600 py-3 rounded-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            Sign up
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="p-8 bg-white rounded-2xl shadow-lg w-[28rem] space-y-6 transform hover:scale-105 transition-transform duration-200">
        <h1 className="text-2xl font-bold text-gray-800">Hello, {session.user?.name || session.user?.email} 👋</h1>
        <button
          onClick={() => router.push('/chat')}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 shadow-md"
        >
          Enter Chat
        </button>
        <button
          onClick={() => signOut()}
          className="w-full bg-white text-red-500 py-3 rounded-lg font-medium border-2 border-red-500 hover:bg-red-50 transition-colors duration-200"
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
