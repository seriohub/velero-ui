import useSWR from 'swr';
import { useAppStatus } from '@/contexts/AppContext';
import { useServerStatus } from '@/contexts/ServerContext';
import axios from 'axios';


interface UseAuthParams {
    middleware?: string;
    redirectIfAuthenticated?: string;
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: UseAuthParams = {}) => {
    // const router = useRouter();
    // const pathname = usePathname();

    const serverValues = useServerStatus();
    const appValues = useAppStatus();
    // const { logout } = useAuthLogout();

    const jwtToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: Record<string, string> = jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {};
    const { data: user, error, mutate } = useSWR(
        `${serverValues?.currentServer?.url}/v1/users/me/info`,
        () =>
            axios
                .get(`${serverValues?.currentServer?.url}/v1/users/me/info`, { headers })
                .then(res => {
                    //userValues.setUser(res.data.data);
                    appValues.setIsUserLoaded(true);
                    appValues.setAuthenticated(true);
                    return res.data.data;
                })
                .catch(error => {
                    console.error("error", error);
                    // if (error.response.status === 401) logout()
                    return undefined;
                })
    );

    /*useEffect(() => {
        if (user) {
            appValues.setAuthenticated(true);
        } else {
            appValues.setAuthenticated(false);
        }

        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            router.push(redirectIfAuthenticated);
        }

        if (pathname === '/verify-email' && user?.email_verified_at) {
            router.push(redirectIfAuthenticated || '/');
        }

        if (middleware === 'auth' && error) {
            logout();
        }
    }, [user, error]);*/

    return {
        user,
        error,
        //logout,
        mutate,
    };
};
