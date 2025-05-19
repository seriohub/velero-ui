'use client';

import { useState } from 'react';
import { useApiLogger } from '../logger/useApiLogger';
import { useUserNotificationHistory } from '../user/useUserNotificationHistory';
import { useAuthErrorHandler } from '../user/useAuthErrorHandler';
import { handleApiResponse } from './handleApiResponse';
import { ApiResponseShowErrorNotification } from '@/components/Display/ApiNotification';
import { parseApiResponse } from '@/hooks/utils/parseApiResponse';
import { buildBackendUrl } from "@/utils/backend";
import { useServerStatus } from "@/contexts/ServerContext";
import { useAgentStatus } from "@/contexts/AgentContext";

export const useApiPut = () => {
  const { logout } = useAuthErrorHandler();

  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();

  const { addNotificationHistory } = useUserNotificationHistory();
  const {
    addApiRequestHistory,
    addApiResponseHistory
  } = useApiLogger();

  const [fetchedTime, setFetchedTime] = useState<string | undefined>(undefined);
  const [fetching, setFetching] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | undefined>(undefined);
  const [error, setError] = useState(false);

  const putData = async (url: string, values: any, target = 'agent') => {
    if (error) {
      setError(false);
    }

    const backendUrl = buildBackendUrl({
      target: target as 'core' | 'agent' | 'static',
      serverValues,
      agentValues,
    });

    setResponseStatus(undefined);

    // Retrieves the JWT token from the localStorage
    const jwtToken = localStorage.getItem('token');

    // Add the JWT token to the header, if present
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (jwtToken) {
      headers.Authorization = `Bearer ${jwtToken}`;
    }
    const requestOptions = {
      method: 'PUT',
      headers,
      body: JSON.stringify(values),
    };

    addApiRequestHistory({
      method: 'PUT',
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
          setData: () => {
          },
          setFetchedTime,
          setError,
          addNotificationHistory,
          addApiResponseHistory,
          addInHistory: true,
          backendUrl,
          url,
          params: values,
          method: 'PUT',
        });
      })
      .catch((err) => {
        setFetching(false);
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
    responseStatus,
    putData,
  };
};
