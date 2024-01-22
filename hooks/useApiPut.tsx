import { useState, useContext } from 'react';

import { notifications } from '@mantine/notifications';

import { IconInfoCircle, IconExclamationMark } from '@tabler/icons-react';

import { env } from 'next-runtime-env';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';

export const useApiPut = () => {
  const value = useContext(VeleroAppContexts);
  const NEXT_PUBLIC_VELERO_API_URL = env('NEXT_PUBLIC_VELERO_API_URL');

  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  const [responseStatus, setResponseStatus] = useState(-1);

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
    value.setApiHistory((prev: Array<any>) =>
      // prev.concat({ method: 'POST', url: `${process.env.NEXT_PUBLIC_VELERO_API_URL}${url}`, params: values })
      prev.concat({ method: 'PUT', url: `${NEXT_PUBLIC_VELERO_API_URL}${url}`, params: values })
    );
    // fetch(`${process.env.NEXT_PUBLIC_VELERO_API_URL}${url}`, requestOptions)
    fetch(`${NEXT_PUBLIC_VELERO_API_URL}${url}`, requestOptions)
      .then((res) => {
        setResponseStatus(res.status);
        if (res.status !== 200) {
          notifications.show({
            icon: <IconExclamationMark />,
            color: 'red',
            title: res.status,
            message: res.statusText,
          });
        }
        return res.json();
      })
      .then((res) => {
        if ('detail' in res) {
          notifications.show({
            icon: <IconExclamationMark />,
            color: 'red',
            title: res.detail.error.title,
            message: res.detail.error.description,
          });
          setError(true);
        }
        if ('error' in res) {
          notifications.show({
            icon: <IconExclamationMark />,
            color: 'red',
            title: res.error.title,
            message: res.error.description,
          });
          setError(true);
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
      });
  };

  return {
    fetching,
    responseStatus,
    putData,
  };
};
