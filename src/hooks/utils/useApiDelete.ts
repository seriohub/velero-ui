import { useState } from 'react';

import { useBackend } from '../useBackend';

import { useApiLogger } from '../logger/useApiLogger';
import { useUserNotificationHistory } from '../user/useUserNotificationHistory';
import { useAuthErrorHandler } from '../user/useAuthErrorHandler';
import {
  ApiResponseShowErrorNotification,
} from '@/components/APIResponseNotification';
import { handleApiResponse } from './handleApiResponse';

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

  const backendUrl = useBackend({ target: target });

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

    addApiRequestHistory({ method: 'DELETE', url: `${backendUrl}${url}}`, params: params });

    setFetching(true);
    fetch(`${backendUrl}${url}`, requestOptions)
      .then(async (res) => {

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
        /*const data = res.data;
        const statusCode = res.status;
       
        if ('error' in data) {
          setData(undefined);
          setError(true);

          ApiResponseShowErrorNotification({
            title: data.error.title,
            message: data.error.description
          })          
          addNotificationHistory({
            statusCode: statusCode,
            title: data.error.title,
            description: data.error.description,
          });
        } else if ('data' in data) {
          setData(res);
        }

        if ('notifications' in data) {
          data.notifications.map((message: any) => {
            ApiResponseShowNotification({
              title: message.title,
              message: message.description,
              type: message?.info,
            });
            addNotificationHistory({
              statusCode: statusCode,
              title: message.title,
              description: message.description,
            });
            return null;
          });
        }

        setFetching(false);

        addApiResponseHistory({
          method: 'DELETE',
          url: `${backendUrl}${url}`,
          param: params,
          data: data,
          statusCode: statusCode,
          xProcessTime: res.xProcessTime,
        });*/
        setFetching(false);
        handleApiResponse({
          res,
          setData,
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
        ApiResponseShowErrorNotification({
          title: 'Error',
          message: `Oops, something went wrong. ${err}`,
        });
      });
  };

  return {
    fetching,
    data,
    deleteData,
    error,
  };
};
