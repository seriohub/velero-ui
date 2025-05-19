'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader, Center } from '@mantine/core';

import { useAuth } from '@/hooks/user/useAuth';
import { useAppStatus } from "@/contexts/AppContext";
import { env } from "next-runtime-env";

interface AuthGateProps {
  children: React.ReactNode;
  guestOnly?: boolean;
}

export default function AuthGate({
                                   children,
                                   guestOnly = false
                                 }: AuthGateProps) {

  const appValues = useAppStatus();
  const {
    user,
    error
  } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const loggerEnabled = env('NEXT_PUBLIC_AUTH_ENABLED')?.toLocaleLowerCase() === 'true';

  useEffect(() => {
    const check = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      // if auth disabled via config → always access
      if (!loggerEnabled) {
        if (pathname === '/') {
          router.push('/dashboard');
        } else {
          setChecking(false);
        }
        return;
      }

      // if there is no token or error
      if (!token || error) {
        localStorage.removeItem('token');

        const isLoginRoute = pathname.startsWith('/login');
        const isRoot = pathname === '/';

        if (!guestOnly) {
          const searchParams = new URLSearchParams(window.location.search);
          const existingNext = searchParams.get('next');
          const shouldRedirect = !isLoginRoute && !isRoot;

          const redirectTarget = existingNext
            ? `?next=${encodeURIComponent(existingNext)}`
            : shouldRedirect
              ? `?next=${encodeURIComponent(pathname)}`
              : '';

          router.replace(`/login${redirectTarget}`);
        }

        setChecking(false);
        return;
      }

      // if authenticated user and this is a guest page
      if (guestOnly && user) {
        router.push('/dashboard');
        return;
      }

      // all okay
      setChecking(false);
    };

    check();
  }, [user, error, appValues?.isAuthenticated, guestOnly, pathname, router]);

  if (checking) {
    return (
      <Center h="100vh">
        <Loader/>
      </Center>
    );
  }

  return <>{children}</>;
}
