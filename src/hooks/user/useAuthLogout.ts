import { useAppStatus } from '@/contexts/AppContext';
import { useRouter, usePathname } from 'next/navigation';

export const useAuthLogout = () => {
    const router = useRouter();
    const pathname = usePathname();
    const appValues = useAppStatus();

    const logout = async () => {
        localStorage.removeItem('token');
        appValues.setAuthenticated(false);

        if (!['/login', '/'].includes(pathname)) {
            router.push('/');
        }
    };

    return {
        logout,
    };
};
