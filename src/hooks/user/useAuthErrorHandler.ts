'use client';

import { useAppStatus } from '@/contexts/AppContext';
import { clearInMemoryCache } from "@/cache/inMemoryCache";

export const useAuthErrorHandler = () => {
  const appValues = useAppStatus();

  const logout = async () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('next');
    appValues.setAuthenticated(false);
    appValues.setIsUserLoaded(false);
    clearInMemoryCache();
  };

  return {
    logout,
  };
};
