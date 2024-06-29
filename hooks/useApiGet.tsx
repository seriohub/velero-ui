import { useContext, useState } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { IconExclamationMark, IconInfoCircle } from '@tabler/icons-react';

import { env } from 'next-runtime-env';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';
import { Code } from '@mantine/core';

export const useApiGet = () => {
  const appValues = useContext(VeleroAppContexts);
  const router = useRouter();
  const pathname = usePathname();
  const value = useContext(VeleroAppContexts);
  
  // const NEXT_PUBLIC_VELERO_API_URL = env('NEXT_PUBLIC_VELERO_API_URL');
  const NEXT_PUBLIC_VELERO_API_URL = appValues.state.currentBackend?.url;

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
      // 'Content-Type': 'application/json',
    };

    if (jwtToken) {
      headers.Authorization = `Bearer ${jwtToken}`;
    }

    if (addInHistory === true) {
      value.setApiRequest((prev: Array<any>) =>
        prev.concat({
          method: 'GET',
          headers,
          url: `${NEXT_PUBLIC_VELERO_API_URL}${url}?${param}`,
          params: param,
        })
      );
    }

    fetch(`${NEXT_PUBLIC_VELERO_API_URL}${url}?${param}`, { method: 'GET', headers })
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
          value.setNotificationHistory((prev: Array<any>) =>
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
            value.setNotificationHistory((prev: Array<any>) =>
              prev.concat({
                statusCode: statusCode,
                title: message.title,
                description: message.description,
              })
            );
            return null;
          });
        }
        if ('messages' in data) {
          data.messages.map((message: any) => {
            modals.open({
              title: message.title,
              size: 'lg',
              children: <Code block color="#010101">
              {message.description.join("\n")}
            </Code>
            });
          });
        }
        setFetching(false);
        if (addInHistory === true) {
          value.setApiResponse((prev: Array<any>) =>
            prev.concat({
              method: 'GET',
              url: `${NEXT_PUBLIC_VELERO_API_URL}${url}?${param}`,
              data: data,
              statusCode: statusCode,
              xProcessTime: res.xProcessTime,
            })
          );
        }
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
