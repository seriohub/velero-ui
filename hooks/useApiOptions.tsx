import { useContext, useState } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { notifications } from '@mantine/notifications';

import { IconExclamationMark, IconInfoCircle } from '@tabler/icons-react';

import { env } from 'next-runtime-env';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';

export const useApiOptions = () => {
  const router = useRouter();
  const pathname = usePathname();
  const value = useContext(VeleroAppContexts);
  const NEXT_PUBLIC_VELERO_API_URL = env('NEXT_PUBLIC_VELERO_API_URL');

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
      value.setApiHistory((prev: Array<any>) =>
        prev.concat({
          method: 'OPTIONS',
          headers,
          //url: `${process.env.NEXT_PUBLIC_VELERO_API_URL}${url}?${param}`,
          url: `${NEXT_PUBLIC_VELERO_API_URL}${url}?${param}`,
          params: param,
        })
      );
    }

    // fetch(`${process.env.NEXT_PUBLIC_VELERO_API_URL}${url}?${param}`, { method: 'GET' })
    fetch(`${NEXT_PUBLIC_VELERO_API_URL}${url}?${param}`, { method: 'OPTIONS', headers })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          if (pathname !== '/login' && pathname !== '/' ) router.push('/');
        }
        return res.json();
      })
      .then((res) => {
        if ('error' in res) {
          notifications.show({
            icon: <IconExclamationMark />,
            color: 'red',
            title: res.error.title,
            message: res.error.description,
          });
          setData(undefined);
          setError(true);
        } else if ('data' in res) {
          setData(res.data);
        } else if ('messages' in res) {
          res.messages.map((message: any) => {
            notifications.show({
              icon: <IconInfoCircle />,
              color: 'blue',
              title: message.title,
              message: message.description,
            });
            return null;
          });
        }
        setFetching(false);
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
