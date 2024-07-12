import { useContext, useState } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { notifications } from '@mantine/notifications';

import { IconExclamationMark, IconInfoCircle } from '@tabler/icons-react';

// import { env } from 'next-runtime-env';

import { useAppState } from '@/contexts/AppStateContext';
import { useBackend } from './useBackend';

interface UseApiOptionsProps {
  target?: 'core' | 'agent' | 'static';
}

export const useApiOptions = ({ target = 'agent' }: UseApiOptionsProps = {}) => {
  const appValues = useAppState();
  const router = useRouter();
  const pathname = usePathname();

  const backendUrl = useBackend({ target: target });

  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<Record<string, any> | undefined>(undefined);
  const [error, setError] = useState(false);

  const getData = async (url: string, param: string = '', addInHistory: boolean = true) => {
    if (error) {
      setError(false);
    }
    setFetching(true);

    // Recupera il token JWT dal localStorage
    const jwtToken = localStorage.getItem('token');

    // Aggiungi il token JWT all'header, se presente
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (jwtToken) {
      headers.Authorization = `Bearer ${jwtToken}`;
    }

    if (addInHistory === true) {
      appValues.setApiRequest((prev: Array<any>) =>
        prev.concat({
          method: 'OPTIONS',
          headers,
          url: `${backendUrl}${url}?${param}`,
          params: param,
        })
      );
    }

    fetch(`${backendUrl}${url}?${param}`, { method: 'OPTIONS', headers })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          if (pathname !== '/login' && pathname !== '/') router.push('/');
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
          setData(undefined);
          setError(true);
          appValues.setNotificationHistory((prev: Array<any>) =>
            prev.concat({
              statusCode: statusCode,
              title: data.error.title,
              description: data.error.description,
            })
          );
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
            appValues.setNotificationHistory((prev: Array<any>) =>
              prev.concat({
                statusCode: statusCode,
                title: message.title,
                description: message.description,
              })
            );
            return null;
          });
        }
        setFetching(false);

        appValues.setApiResponse((prev: Array<any>) =>
          prev.concat({
            method: 'OPTIONS',
            url: `${backendUrl}${url}?${param}`,
            data: data,
            statusCode: statusCode,
            xProcessTime: res.xProcessTime,
          })
        );
      })
      .catch((err) => {
        notifications.show({
          icon: <IconExclamationMark />,
          color: 'red',
          title: 'Error',
          message: `Oops, something went wrong. ${err}`,
        });
        setFetching(false);
        setData(undefined);
        setError(true);
      });
  };

  return {
    fetching,
    data,
    getData,
    setData,

    error,
  };
};
