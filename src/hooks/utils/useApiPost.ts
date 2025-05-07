import { useState } from 'react';

import { useBackend } from '../useBackend';

import { useApiLogger } from '../logger/useApiLogger';
import { useUserNotificationHistory } from '../user/useUserNotificationHistory';

import { useAuthErrorHandler } from '../user/useAuthErrorHandler';
import { handleApiResponse } from './handleApiResponse';
import { ApiResponseShowErrorNotification } from '@/components/Display/ApiNotification';
import { parseApiResponse } from '@/hooks/utils/parseApiResponse';
import { useServerStatus } from "@/contexts/ServerContext";
import { useAgentStatus } from "@/contexts/AgentContext";

interface UseApiPostProps {
  target?: 'core' | 'agent' | 'static';
}

export const useApiPost = () => {
  const { logout } = useAuthErrorHandler();

  const { addNotificationHistory } = useUserNotificationHistory();
  const { addApiRequestHistory, addApiResponseHistory } = useApiLogger();
  const [fetchedTime, setFetchedTime] = useState<string | undefined>(undefined);

  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();

  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<Record<string, any> | undefined>(undefined);
  const [error, setError] = useState(false);

  const postData = async (url: string, values: any,  target = 'agent') => {
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

    // Recupera il token JWT dal localStorage
    const jwtToken = localStorage.getItem('token');

    // Aggiungi il token JWT all'header, se presente
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (jwtToken) {
      headers.Authorization = `Bearer ${jwtToken}`;
    }

    const requestOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify(values),
    };

    addApiRequestHistory({
      method: 'POST',
      url: `${backendUrl}${url}`,
      params: values,
    });

    setFetching(true);
    fetch(`${backendUrl}${url}`, requestOptions)
      .then(parseApiResponse)
      .then((res) => {
        setFetching(false);
        handleApiResponse({
          res,
          setData,
          setError,
          addNotificationHistory,
          setFetchedTime,
          addApiResponseHistory,
          addInHistory: true,
          backendUrl,
          url,
          params: values,
          method: 'POST',
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
    data,
    postData,
    error,
  };
};
