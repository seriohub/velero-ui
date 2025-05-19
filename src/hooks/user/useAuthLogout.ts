import { useRouter, usePathname } from 'next/navigation';
import { useAppStatus } from '@/contexts/AppContext';

export const useAuthLogout = () => {
  const router = useRouter();
  const appValues = useAppStatus();

  const logout = async () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('next');
    appValues.setAuthenticated(false);
    router.push('/login');
  };

  return {
    logout,
  };
};
