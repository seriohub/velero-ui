import { useRouter } from 'next/navigation';
import { useAppStatus } from '@/contexts/AppContext';
import { clearInMemoryCache } from "@/cache/inMemoryCache";

export const useAuthLogout = () => {
  const router = useRouter();
  const appValues = useAppStatus();

  const logout = async () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('next');
    appValues.setAuthenticated(false);
    appValues.setIsUserLoaded(false);
    clearInMemoryCache();
    router.push('/login');
  };

  return {
    logout,
  };
};
