import { useRouter, usePathname } from 'next/navigation';

interface UseAuthParams {
    middleware?: string;
    redirectIfAuthenticated?: string;
}

export const useAuthErrorHandler = ({ middleware, redirectIfAuthenticated }: UseAuthParams = {}) => {
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
