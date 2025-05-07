import { useState } from 'react';

import { useBackend } from '../useBackend';

import { useApiLogger } from '../logger/useApiLogger';
import { useUserNotificationHistory } from '../user/useUserNotificationHistory';
import { useAuthErrorHandler } from '../user/useAuthErrorHandler';
import { ApiResponseShowErrorNotification } from '@/components/Display/ApiNotification';
import { handleApiResponse } from './handleApiResponse';
import { parseApiResponse } from '@/hooks/utils/parseApiResponse';

type DeleteParams = {
  url: string;
  params?: any;
};

interface UseApiGetProps {
  target?: 'core' | 'agent' | 'static';
}

export const useApiDelete = ({ target = 'agent' }: UseApiGetProps = {}) => {
  const { logout } = useAuthErrorHandler();

  const { addNotificationHistory } = useUserNotificationHistory();
  const { addApiRequestHistory, addApiResponseHistory } = useApiLogger();
  const [fetchedTime, setFetchedTime] = useState<string | undefined>(undefined);

  const backendUrl = useBackend({ target });

  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<Record<string, any> | undefined>(undefined);
  const [error, setError] = useState(false);

  const deleteData = async ({ url, params }: DeleteParams) => {
    if (error) {
      setError(false);
    }

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
      method: 'DELETE',
      headers,
      body: JSON.stringify(params),
    };

    addApiRequestHistory({
      method: 'DELETE',
      url: `${backendUrl}${url}}`,
      params,
    });

    setFetching(true);
    fetch(`${backendUrl}${url}`, requestOptions)
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
          addInHistory: true,
          backendUrl,
          url,
          params,
          method: 'DELETE',
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
    fetchedTime,
    data,
    deleteData,
    error,
  };
};
