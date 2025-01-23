import { useState } from 'react';

import { useBackend } from '../useBackend';

import { useApiLogger } from '../logger/useApiLogger';
import { useUserNotificationHistory } from '../user/useUserNotificationHistory';
import { useAuthErrorHandler } from '../user/useAuthErrorHandler';
import { handleApiResponse } from './handleApiResponse';
import { ApiResponseShowErrorNotification } from '@/components/APIResponseNotification';

interface UseApiPutProps {
  target?: 'core' | 'agent' | 'static';
}

export const useApiPut = ({ target = 'agent' }: UseApiPutProps = {}) => {
  const { logout } = useAuthErrorHandler();

  const { addNotificationHistory } = useUserNotificationHistory();
  const { addApiRequestHistory, addApiResponseHistory } = useApiLogger();

  const backendUrl = useBackend({ target });

  const [fetching, setFetching] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | undefined>(undefined);
  const [error, setError] = useState(false);

  const putData = async (url: string, values: any) => {
    if (error) {
      setError(false);
    }

    setResponseStatus(undefined);

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
      .then(async (res) => {
        setResponseStatus(res.status);

        if (res.status !== 200) {
          ApiResponseShowErrorNotification({
            title: res.status.toString(),
            message: res.statusText,
          });
        }

        if (res.status === 401) {
          logout();
        }

        return res.json().then((response) => {
          return {
            data: response,
            status: res.status,
            xProcessTime: res.headers.get('X-Process-Time'),
          };
        });
      })
      .then((res) => {
        setFetching(false);
        handleApiResponse({
          res,
          setData: () => {},
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
        ApiResponseShowErrorNotification({
          title: 'Error',
          message: `Oops, something went wrong. ${err}`,
        });
      });
  };

  return {
    fetching,
    responseStatus,
    putData,
  };
};
