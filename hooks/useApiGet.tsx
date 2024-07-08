import { useContext, useState } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { IconExclamationMark, IconInfoCircle } from '@tabler/icons-react';

// import { env } from 'next-runtime-env';

import { useAppState } from '@/contexts/AppStateContext';
import { Code } from '@mantine/core';
import { useBackend } from './useBackend';
import { useServerStatus } from '@/contexts/ServerStatusContext';
import { useAgentStatus } from '@/contexts/AgentStatusContext';

interface UseApiGetProps {
  target?: 'core' | 'agent' | 'static';
}
type TargetType = 'core' | 'agent' | 'static';
type GetDataParams = {
  url: string;
  param?: string;
  addInHistory?: boolean;
  target?: TargetType;
};

//export const useApiGet = ({ target = 'agent' }: UseApiGetProps = {}) => {
export const useApiGet = () => {
  const router = useRouter();
  const pathname = usePathname();

  const appValues = useAppState();
  const isServerAvailable = useServerStatus();
  const isAgentAvailable = useAgentStatus()

  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<Record<string, any> | undefined>(undefined);
  const [error, setError] = useState(false);

  //const backendUrl = useBackend({ target: target });

  const getData = async ({
    url,
    param = '',
    addInHistory = true,
    target = 'agent',
  }: GetDataParams) => {
    
    const NEXT_PUBLIC_VELERO_API_URL = appValues?.currentServer?.url;
    const coreUrl = appValues.isCurrentServerControlPlane
      ? target === 'core'
        ? '/core'
        : target === 'static'
          ? ''
          : `/agent/${appValues.currentAgent?.name}`
      : '';

    const backendUrl = `${NEXT_PUBLIC_VELERO_API_URL}${coreUrl}`;
    
    if (!isServerAvailable) {
      //else {
      console.log(`Server unavailable: skip request ${backendUrl}${url}?${param}`);
      return
      //}
    }
    if (target == 'agent' && url!='/online' && (appValues.currentAgent == undefined || !isAgentAvailable) ) {
      console.log(`Agent unavailable: skip request ${url}?${param}`);
      return
    }
    //const backendUrl = useBackend({ target: target });

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
      appValues.setApiRequest((prev: Array<any>) =>
        prev.concat({
          method: 'GET',
          headers,
          url: `${backendUrl}${url}?${param}`,
          params: param,
        })
      );
    }

    fetch(`${backendUrl}${url}?${param}`, { method: 'GET', headers })
      .then(async (res) => {
        if (res.status === 400){
          console.log("400")
          throw 'Agent Offline'
        }
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
        if ('messages' in data) {
          data.messages.map((message: any) => {
            modals.open({
              title: message.title,
              size: 'lg',
              children: (
                <Code block color="#010101">
                  {message.description.join('\n')}
                </Code>
              ),
            });
          });
        }
        setFetching(false);
        if (addInHistory === true) {
          appValues.setApiResponse((prev: Array<any>) =>
            prev.concat({
              method: 'GET',
              url: `${backendUrl}${url}?${param}`,
              data: data,
              statusCode: statusCode,
              xProcessTime: res.xProcessTime,
            })
          );
        }
      })

      .catch((err) => {
        setFetching(false);
        setData(undefined);
        setError(true);
        if (err == 'Agent Offline')
          return
        notifications.show({
          icon: <IconExclamationMark />,
          color: 'red',
          title: 'Error',
          message: `Oops, something went wrong. ${err}`,
        });
        
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
