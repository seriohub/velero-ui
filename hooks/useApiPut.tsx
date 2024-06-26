import { useState, useContext } from 'react';

import { notifications } from '@mantine/notifications';

import { IconInfoCircle, IconExclamationMark } from '@tabler/icons-react';

import { env } from 'next-runtime-env';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';

export const useApiPut = () => {
  const appValues = useContext(VeleroAppContexts);
  
  // const NEXT_PUBLIC_VELERO_API_URL = env('NEXT_PUBLIC_VELERO_API_URL');
  const NEXT_PUBLIC_VELERO_API_URL = appValues.state.currentBackend?.url;

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
    appValues.setApiRequest((prev: Array<any>) =>
      prev.concat({ method: 'PUT', url: `${NEXT_PUBLIC_VELERO_API_URL}${url}`, params: values })
    );

    fetch(`${NEXT_PUBLIC_VELERO_API_URL}${url}`, requestOptions)
      .then(async (res) => {
        setResponseStatus(res.status);
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
        if ('detail' in res) {
          notifications.show({
            icon: <IconExclamationMark />,
            color: 'red',
            title: data.detail.error.title,
            message: data.detail.error.description,
          });
          setError(true);
          appValues.setNotificationHistory((prev: Array<any>) =>
            prev.concat({
              statusCode: statusCode,
              title: data.error.title,
              description: data.error.description,
            })
          );
        }
        if ('error' in res) {
          notifications.show({
            icon: <IconExclamationMark />,
            color: 'red',
            title: data.error.title,
            message: data.error.description,
          });
          setError(true);
        }
        if ('notifications' in res) {
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
            method: 'POST',
            url: `${NEXT_PUBLIC_VELERO_API_URL}${url}`,
            params: values,
            data: data,
            statusCode: statusCode,
            xProcessTime: res.xProcessTime,
          })
        );
      });
  };

  return {
    fetching,
    responseStatus,
    putData,
  };
};
