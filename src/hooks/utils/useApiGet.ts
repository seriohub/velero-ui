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

type TargetType = 'core' | 'agent' | 'static';

type GetDataParams = {
  url: string;
  params?: string;
  addInHistory?: boolean;
  target?: TargetType;
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
                         }: GetDataParams) => {
    if (error) {
      setError(false);
    }

    let coreUrl = '';
    if (serverValues.isCurrentServerControlPlane) {
      if (target === 'core') {
        coreUrl = '/core';
      } else if (target === 'static') {
        coreUrl = '';
      } else {
        const agentName = agentValues?.currentAgent?.name;
        coreUrl = `/agent/${agentName}`;
      }
    }

    const backendUrl = `${serverValues?.currentServer?.url}${coreUrl}`;

    if (!window) {
      console.log(`Window unavailable: skip request ${backendUrl}${url}?${params}`);
      return;
    }

    if (!serverValues.isServerAvailable) {
      console.log(`Server unavailable: skip request ${backendUrl}${url}?${params}`);
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

    // Recupera il token JWT dal localStorage
    const jwtToken = localStorage.getItem('token');

    // Aggiungi il token JWT all'header, se presente
    const headers: any = {
      // 'Content-Type': 'application/json',
    };

    if (jwtToken) {
      headers.Authorization = `Bearer ${jwtToken}`;
    }

    if (addInHistory) {
      addApiRequestHistory({
        method: 'GET',
        headers,
        url: `${backendUrl}${url}?${params}`,
        params,
      });
    }

    setFetching(true);
    fetch(`${backendUrl}${url}?${params}`, {
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
