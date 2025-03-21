import useSWR from 'swr';
import axios from 'axios';
import { env } from 'next-runtime-env';
import { useAppStatus } from '@/contexts/AppContext';
import { useServerStatus } from '@/contexts/ServerContext';

interface UseAuthParams {
  middleware?: string;
  redirectIfAuthenticated?: string;
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: UseAuthParams = {}) => {
  const NEXT_PUBLIC_AUTH_ENABLED = env('NEXT_PUBLIC_AUTH_ENABLED')?.toLowerCase() !== 'false';

  const serverValues = useServerStatus();
  const appValues = useAppStatus();

  const jwtToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {};
  const {
    data: user,
    error,
    mutate,
  } = useSWR(
    NEXT_PUBLIC_AUTH_ENABLED ? `${serverValues?.currentServer?.url}/v1/users/me/info` : null,
    () =>
      axios
        .get(`${serverValues?.currentServer?.url}/v1/users/me/info`, { headers })
        .then((res) => {
          //userValues.setUser(res.data.data);
          appValues.setIsUserLoaded(true);
          appValues.setAuthenticated(true);
          return res.data.data;
        })
        .catch((e) => {
          console.error('error', e);
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
    user: NEXT_PUBLIC_AUTH_ENABLED
      ? user
      : {
          id: 0,
          username: 'Guest',
          email: '- no guest email -',
        },
    error,
    mutate,
  };
};
