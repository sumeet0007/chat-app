// app/layout.tsx (NOT a server component)

'use client'; // ✅ Required to use hooks

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
