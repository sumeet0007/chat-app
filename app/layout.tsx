// app/layout.tsx (NOT a server component)

'use client'; // ✅ Required to use hooks

import './globals.css';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import Navbar from './components/Navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SessionProvider>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
