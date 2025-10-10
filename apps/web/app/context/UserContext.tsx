// app/context/UserContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type UserContextType = {
  name: string;
  setName: (name: string) => void;
};

const UserContext = createContext<UserContextType>({
  name: 'New User',
  setName: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [name, setName] = useState('New User');

  // Initialize name from session
  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook for easy use
export const useUser = () => useContext(UserContext);
