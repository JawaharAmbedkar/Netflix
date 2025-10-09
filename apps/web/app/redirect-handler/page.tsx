'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RedirectHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || !session?.user) {
      router.push('/signin');
      return;
    }

    if (session.user.membership) {
      router.push('/');
    } else {
      router.push('/membership-payment');
    }
  }, [session, status, router]);

  return <div className="text-white text-center p-10">Redirecting...</div>;
}
