// hooks/useAuth.js
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      // Wait until session is loaded
      return;
    }

    if (!session) {
      // If there is no session, redirect to the login page
      router.push('/login');
    }
  }, [session, status, router]);

  return session;
};

export default useAuth;
