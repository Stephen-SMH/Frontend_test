// src/app/layout.tsx

"use client"

import { ReactNode, useEffect } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Ensures the WebSocket server is initialized at least once
    fetch('/api/socket');
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
