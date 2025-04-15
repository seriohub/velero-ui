import { useState } from 'react';

import { useBackend } from '../useBackend';

import { useApiLogger } from '../logger/useApiLogger';
import { useUserNotificationHistory } from '../user/useUserNotificationHistory';

import { useAuthErrorHandler } from '../user/useAuthErrorHandler';
import { handleApiResponse } from './handleApiResponse';
import { ApiResponseShowErrorNotification } from '@/components/Display/ApiNotification';
import { parseApiResponse } from '@/hooks/utils/parseApiResponse';

interface UseApiPatchProps {
  target?: 'core' | 'agent' | 'static';
}

export const useApiPatch = ({ target = 'agent' }: UseApiPatchProps = {}) => {
  const { logout } = useAuthErrorHandler();

  const { addApiRequestHistory, addApiResponseHistory } = useApiLogger();
  const { addNotificationHistory } = useUserNotificationHistory();
  const [fetchedTime, setFetchedTime] = useState<string | undefined>(undefined);

  const backendUrl = useBackend({ target });

  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<Record<string, any> | undefined>(undefined);
  const [error, setError] = useState(false);

  const patchData = async (url: string, values: any) => {
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
      method: 'PATCH',
      headers,
      body: JSON.stringify(values),
    };

    addApiRequestHistory({
      method: 'PATCH',
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
          setFetchedTime,
          setError,
          addNotificationHistory,
          addApiResponseHistory,
          addInHistory: true,
          backendUrl,
          url,
          params: values,
          method: 'PATCH',
        });
      })
      .catch((err) => {
        setFetching(false);
        setData(undefined);
        setError(true);

        // console.error('Fetch error:', err.message);

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
    patchData,
    error,
  };
};
