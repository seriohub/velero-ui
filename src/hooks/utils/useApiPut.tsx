import { useState } from 'react';

import { notifications } from '@mantine/notifications';

import { IconInfoCircle, IconExclamationMark } from '@tabler/icons-react';

import { useBackend } from '../useBackend';

import { useApiLogger } from '../logger/useApiLogger';
import { useUserNotificationHistory } from '../user/useUserNotificationHistory';
import { useAuthErrorHandler } from '../user/useAuthErrorHandler';

interface UseApiPutProps {
  target?: 'core' | 'agent' | 'static';
}

export const useApiPut = ({ target = 'agent' }: UseApiPutProps = {}) => {
  const { addNotificationHistory } = useUserNotificationHistory();
const { logout } = useAuthErrorHandler();
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  const [responseStatus, setResponseStatus] = useState(-1);
  const { addApiRequestHistory, addApiResponseHistory } = useApiLogger();

  const backendUrl = useBackend({ target: target });

  const putData = async (url: string, values: any) => {
    setResponseStatus(-1);
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
      method: 'PUT',
      headers,
      body: JSON.stringify(values),
    };

    setFetching(true);
    addApiRequestHistory({ method: 'PUT', url: `${backendUrl}${url}`, params: values });

    fetch(`${backendUrl}${url}`, requestOptions)
      .then(async (res) => {
        setResponseStatus(res.status);
        if (res.status === 401) {
          logout();
        }

        if (res.status !== 200) {
          notifications.show({
            icon: <IconExclamationMark />,
            color: 'red',
            title: res.status,
            message: res.statusText,
          });
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
        const data = res.data;
        const statusCode = res.status;

        if ('detail' in data) {
          notifications.show({
            icon: <IconExclamationMark />,
            color: 'red',
            title: data.detail.error.title,
            message: data.detail.error.description,
          });
          setError(true);
          addNotificationHistory({
            statusCode: statusCode,
            title: data.error.title,
            description: data.error.description,
          });
        }
        if ('error' in data) {
          notifications.show({
            icon: <IconExclamationMark />,
            color: 'red',
            title: data.error.title,
            message: data.error.description,
          });
          setError(true);
        }
        if ('notifications' in data) {
          data.notifications.map((message: any) => {
            notifications.show({
              icon: <IconInfoCircle />,
              color: 'blue',
              title: message.title,
              message: message.description,
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
          method: 'POST',
          url: `${backendUrl}${url}`,
          params: values,
          data: data,
          statusCode: statusCode,
          xProcessTime: res.xProcessTime,
        });
      });
  };

  return {
    fetching,
    responseStatus,
    putData,
  };
};
