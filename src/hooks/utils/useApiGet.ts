'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentStatus } from '@/contexts/AgentContext';
import { useApiLogger } from '@/hooks/logger/useApiLogger';
import { useUserNotificationHistory } from '../user/useUserNotificationHistory';
import { useAuthErrorHandler } from '../user/useAuthErrorHandler';
import { ApiResponseShowErrorNotification } from '@/components/Display/ApiNotification';
import { handleApiResponse } from './handleApiResponse';
import { parseApiResponse } from './parseApiResponse';
import { buildBackendUrl } from "@/utils/backend";
import { env } from 'next-runtime-env';

const inMemoryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = Number(env('NEXT_PUBLIC_CACHE_TTL') ?? 60) * 1000;

type TargetType = 'core' | 'agent' | 'static';

type GetDataParams = {
  url: string;
  params?: string;
  addInHistory?: boolean;
  target?: TargetType;
  force?: boolean;
  cache?: boolean;
  ttl?: number;
};

export const useApiGet = () => {
  const { logout } = useAuthErrorHandler();
  const router = useRouter();
  const {
    addApiRequestHistory,
    addApiResponseHistory
  } = useApiLogger();
  const { addNotificationHistory } = useUserNotificationHistory();

  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();

  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<Record<string, any> | undefined>(undefined);
  const [fetchedTime, setFetchedTime] = useState<string | undefined>(undefined);
  const [error, setError] = useState(false);

  const getData = async ({
                           url,
                           params = '',
                           addInHistory = true,
                           target = 'agent',
                           force = false,
                           cache = false,
                           ttl
                         }: GetDataParams) => {
    if (error) {
      setError(false);
    }

    const backendUrl = buildBackendUrl({
      target,
      serverValues,
      agentValues,
    });

    // Remove `forced` from the cache key
    const cacheKeyParams = params
      .split('&')
      .filter(p => !p.startsWith('forced='))
      .join('&');

    const fullUrl = `${backendUrl}${url}?${params}`
    const cacheKeyUrl = `${backendUrl}${url}?${cacheKeyParams}`;

    if (cache && !force) {
      const cached = inMemoryCache.get(cacheKeyUrl);
      const ttlToUse = ttl ?? CACHE_TTL;

      if (cached && Date.now() - cached.timestamp < ttlToUse) {
        setData(cached.data);
        return cached.data;
      }
    }

    if (typeof window === 'undefined') {
      console.log(`Window unavailable: skip request ${fullUrl}`);
      return;
    }

    if (!serverValues.isServerAvailable) {
      console.log(`Server unavailable: skip request ${fullUrl}`);
      return;
    }

    if (
      target === 'agent' &&
      url !== '/online' &&
      (agentValues.currentAgent === undefined || !agentValues.isAgentAvailable)
    ) {
      console.log(`Agent unavailable: skip request ${url}?${params}`);
      return;
    }

    // Retrieves the JWT token from the localStorage
    const jwtToken = localStorage.getItem('token');

    // Add the JWT token to the header, if present
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (jwtToken) {
      headers.Authorization = `Bearer ${jwtToken}`;
    }

    if (addInHistory) {
      addApiRequestHistory({
        method: 'GET',
        headers,
        url: `${fullUrl}`,
        params,
      });
    }

    setFetching(true);
    const res = fetch(`${fullUrl}`, {
      method: 'GET',
      // credentials: 'include', // uncomment for cookie auth
      headers,
    })
      .then(parseApiResponse)
      .then((res) => {
        setFetching(false);
        handleApiResponse({
          res,
          setData,
          setFetchedTime,
          setError,
          addNotificationHistory,
          addApiResponseHistory,
          addInHistory,
          backendUrl,
          url,
          params,
          method: 'GET',
        });

        if (cache) {
          inMemoryCache.set(`${cacheKeyUrl}`, {
            data: res?.data?.data,
            timestamp: Date.now(),
          });
        }

        return res?.data?.data;
      })

      .catch((err) => {
        setFetching(false);
        setData(undefined);
        setError(true);
        console.error('Fetch error:', err.message);

        if (err.message.includes('Unauthorized')) {
          logout();
        }
        if (err.message.includes('404')) {
          router.push('/dashboard');
        }

        const title = 'Error';
        const { message } = err;
        ApiResponseShowErrorNotification({
          title,
          message,
        });
      });

    return res;
  };

  return {
    fetching,
    fetchedTime,
    data,
    getData,
    setData,
    error,
  };
};
