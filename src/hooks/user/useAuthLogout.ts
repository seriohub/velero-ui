import useSWR from 'swr';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStatus } from '@/contexts/AppContext';
import { useServerStatus } from '@/contexts/ServerContext';
import axios from 'axios';


interface UseAuthParams {
    middleware?: string;
    redirectIfAuthenticated?: string;
}

export const useAuthLogout = ({ middleware, redirectIfAuthenticated }: UseAuthParams = {}) => {
    const router = useRouter();
    const pathname = usePathname();

    const logout = async () => {
        localStorage.removeItem('token');
        // appValues.setAuthenticated(false);

        if (!['/login', '/'].includes(pathname)) {
            router.push('/');
        }
    };


    return {


        logout,

    };
};
