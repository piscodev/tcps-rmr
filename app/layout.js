// app/layout.js (or app/layout.tsx if using TypeScript)
'use client';

import { SessionProvider } from 'next-auth/react';
import './globals.css'; // Adjust path if needed
import Nav from '../components/Nav'; // Ensure the path is correct

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
         
          <main>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
