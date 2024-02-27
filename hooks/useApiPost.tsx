import { useState, useContext } from 'react';

import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';

import { IconInfoCircle, IconExclamationMark } from '@tabler/icons-react';

import { env } from 'next-runtime-env';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';

export const useApiPost = () => {
  const router = useRouter();
  const value = useContext(VeleroAppContexts);
  const NEXT_PUBLIC_VELERO_API_URL = env('NEXT_PUBLIC_VELERO_API_URL');

  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<Record<string, any> | undefined>(undefined);
  const [error, setError] = useState(false);

  const postData = async (url: string, values: any) => {
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
      method: 'POST',
      headers,
      body: JSON.stringify(values),
    };

    setFetching(true);
    value.setApiHistory((prev: Array<any>) =>
      // prev.concat({ method: 'POST', url: `${process.env.NEXT_PUBLIC_VELERO_API_URL}${url}`, params: values })
      prev.concat({ method: 'POST', url: `${NEXT_PUBLIC_VELERO_API_URL}${url}`, params: values })
    );
    // fetch(`${process.env.NEXT_PUBLIC_VELERO_API_URL}${url}`, requestOptions)
    fetch(`${NEXT_PUBLIC_VELERO_API_URL}${url}`, requestOptions)
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          router.push('/');
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
          setData({});
          setError(true);
        } else if ('data' in res) {
          setData(res);
        }
        if ('messages' in res) {
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
      });
  };

  return {
    fetching,
    data,
    postData,
    error,
  };
};
