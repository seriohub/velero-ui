'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAppStatus } from '@/contexts/AppContext';

export const useAuthErrorHandler = () => {
  const router = useRouter();
  const pathname = usePathname();
  const appValues = useAppStatus();

  const logout = async () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('next');
    appValues.setAuthenticated(false);

    if (!['/login', '/'].includes(pathname)) {
      router.push('/');
    }
  };

  return {
    logout,
  };
};
