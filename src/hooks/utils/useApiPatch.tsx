import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';

import { IconInfoCircle, IconExclamationMark } from '@tabler/icons-react';

import { useBackend } from '../useBackend';

import { useApiLogger } from '../logger/useApiLogger';
import { useUserNotificationHistory } from '../user/useUserNotificationHistory';
import { useAuth } from '../user/useAuth';
import { useAuthErrorHandler } from '../user/useAuthErrorHandler';

interface UseApiPatchProps {
  target?: 'core' | 'agent' | 'static';
}

export const useApiPatch = ({ target = 'agent' }: UseApiPatchProps = {}) => {
  const router = useRouter();
  const { logout } = useAuthErrorHandler();

  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<Record<string, any> | undefined>(undefined);
  const [error, setError] = useState(false);
  const { addApiRequestHistory, addApiResponseHistory } = useApiLogger();
  const { addNotificationHistory } = useUserNotificationHistory();

  const backendUrl = useBackend({ target: target });

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

    setFetching(true);
    addApiRequestHistory({ method: 'PATCH', url: `${backendUrl}${url}`, params: values });

    // fetch(`${process.env.NEXT_PUBLIC_VELERO_API_URL}${url}`, requestOptions)
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
        const data = res.data;
        const statusCode = res.status;

        if ('error' in data) {
          notifications.show({
            icon: <IconExclamationMark />,
            color: 'red',
            title: data.error.title,
            message: data.error.description,
          });
          setData({});
          setError(true);
          addNotificationHistory({
            statusCode: statusCode,
            title: data.error.title,
            description: data.error.description,
          });
        } else if ('data' in data) {
          setData(data.data);
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
          method: 'PATCH',
          url: `${backendUrl}${url}`,
          params: values,
          data: data,
          statusCode: statusCode,
          xProcessTime: res.xProcessTime,
        });
      })
      .catch((err) => {
        notifications.show({
          icon: <IconExclamationMark />,
          color: 'red',
          title: 'Error',
          message: `Oops, something went wrong. ${err}`,
        });
        setFetching(false);
      });
  };

  return {
    fetching,
    data,
    patchData,
    error,
  };
};
