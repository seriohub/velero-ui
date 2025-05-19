'use client';

import useSWR from 'swr';
import axios from 'axios';
import { useAppStatus } from '@/contexts/AppContext';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAuthErrorHandler } from "@/hooks/user/useAuthErrorHandler";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const serverValues = useServerStatus();
  const appValues = useAppStatus();

  const jwtToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const { logout } = useAuthErrorHandler();

  const headers: Record<string, string> = jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {};

  const [fetchKey, setFetchKey] = useState<string | null>(null);

  useEffect(() => {
    if (serverValues?.currentServer?.url && jwtToken) {
      setFetchKey(`${serverValues?.currentServer?.url}/v1/users/me/info`);
    } else {
      console.warn("Server is not available");
    }
  }, [serverValues?.currentServer?.url, jwtToken]);

  const {
    data: user,
    error,
    mutate,
  } = useSWR(
    fetchKey,
    () =>
      axios
        .get(fetchKey!, { headers /*, withCredentials: true // uncomment for cookie auth */ })
        .then((res) => {
          //userValues.setUser(res.data.data);
          appValues.setIsUserLoaded(true);
          appValues.setAuthenticated(true);
          return res.data.data;
        })
        .catch((e) => {
          console.error('error', e);
          if (e.response.status === 401) logout()
          return undefined;
        })
  );
  return {
    user,
    error,
    mutate,
  };
};
