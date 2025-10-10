// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { UserProvider } from './context/UserContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
     <UserProvider>{children}</UserProvider>
    </SessionProvider>
    );
}
