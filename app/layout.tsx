// app/layout.tsx (NOT a server component)

'use client'; // ✅ Required to use hooks

import './globals.css';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import Navbar from './components/Navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#36393f]">
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