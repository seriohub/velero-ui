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

  // Read auth flag from environment variable
  const loggerEnabled = env('NEXT_PUBLIC_AUTH_ENABLED')?.toLocaleLowerCase() === 'true';

  useEffect(() => {
    const check = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      // 🔓 If auth is disabled in config, allow access to all pages
      if (!loggerEnabled) {
        if (pathname === '/') {
          router.push('/dashboard'); // redirect root to dashboard
        } else {
          setChecking(false); // allow access
        }
        return;
      }

      // 🚫 If there's no token or an auth error occurred
      if (!token || error) {
        localStorage.removeItem('token'); // clear invalid token

        const isLoginRoute = pathname.startsWith('/login');
        const isRoot = pathname === '/';

        // If the page is not guest-only, redirect to login
        if (!guestOnly) {
          const searchParams = new URLSearchParams(window.location.search);
          const existingNext = searchParams.get('next');
          const shouldRedirect = !isLoginRoute && !isRoot;

          const redirectTarget = existingNext
            ? `?next=${encodeURIComponent(existingNext)}`
            : shouldRedirect
              ? `?next=${encodeURIComponent(pathname)}`
              : '';

          router.push(`/login${redirectTarget}`);
        }

        // ✅ Allow guest access to login route
        if (isLoginRoute) {
          setChecking(false);
        }

        return;
      }

      // 🔐 If authenticated user tries to access a guest-only page (e.g. /login)
      if (guestOnly && user) {
        router.push('/dashboard');
        return;
      }

      // ✅ If authenticated user on root, redirect to dashboard
      if (user) {
        if (pathname === '/') {
          router.push('/dashboard');
          return;
        }

        // ✅ Authenticated and on a valid page
        setChecking(false);
        return;
      }
    };

    check();
  }, [user, error, appValues?.isAuthenticated, guestOnly, pathname, router]);

  // ⏳ Show loader while checking authentication
  if (checking) {
    return (
      <Center h="100vh">
        <Loader size="lg" type="dots"/>
      </Center>
    );
  }

  // ✅ Render children if access is allowed
  return <>{children}</>;
}
