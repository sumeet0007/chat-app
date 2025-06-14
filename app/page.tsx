'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <p>Loading...</p>;

  if (!session) {
    return (
      <main className="h-screen flex items-center justify-center">
        <div className="p-6 bg-white rounded-xl shadow-md w-80 space-y-4">
          <h1 className="text-xl font-bold">Welcome</h1>
          <p className="text-gray-600">Please sign in to continue</p>
          <button
            onClick={() => signIn()}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Sign up
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-xl shadow-md w-96 space-y-4">
        <h1 className="text-xl font-semibold">Hello, {session.user?.name || session.user?.email} 👋</h1>
        <button
          onClick={() => router.push('/chat')}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Enter Chat
        </button>
        <button
          onClick={() => signOut()}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
