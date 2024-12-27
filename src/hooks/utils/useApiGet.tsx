import { useState } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { IconExclamationMark, IconInfoCircle } from '@tabler/icons-react';

import { Code } from '@mantine/core';

import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentStatus } from '@/contexts/AgentContext';
import { useApiLogger } from '@/hooks/logger/useApiLogger';
import { useUserNotificationHistory } from '../user/useUserNotificationHistory';
import { useAuth } from '../user/useAuth';
import { useAuthErrorHandler } from '../user/useAuthErrorHandler';

type TargetType = 'core' | 'agent' | 'static';
type GetDataParams = {
  url: string;
  param?: string;
  addInHistory?: boolean;
  target?: TargetType;
};

export const useApiGet = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthErrorHandler();

  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();
  const { addApiRequestHistory, addApiResponseHistory } = useApiLogger();
  const { addNotificationHistory } = useUserNotificationHistory();

  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<Record<string, any> | undefined>(undefined);
  const [error, setError] = useState(false);

  const getData = async ({
    url,
    param = '',
    addInHistory = true,
    target = 'agent',
  }: GetDataParams) => {
    const coreUrl = serverValues.isCurrentServerControlPlane
      ? target === 'core'
        ? '/core'
        : target === 'static'
          ? ''
          : `/agent/${agentValues?.currentAgent?.name}`
      : '';
    const backendUrl = `${serverValues?.currentServer?.url}${coreUrl}`;

    // console.log(`Server request ${backendUrl}${url}?${param}`)
    if (!serverValues.isServerAvailable || serverValues.isServerAvailable == undefined) {
      //else {
      console.log(`Server unavailable: skip request ${backendUrl}${url}?${param}`);
      return;
      //}
    }

    //if (target=='core' && (!serverValues.isServerAvailable || serverValues.isCurrentServerControlPlane==undefined)){
    if (target == 'core' && !serverValues.isServerAvailable) {
      // || serverValues.isCurrentServerControlPlane==undefined)){
      console.log(`Server unavailable: skip request ${url}?${param}`);
      return;
    }

    if (
      target == 'agent' &&
      url != '/online' &&
      (agentValues.currentAgent == undefined || !agentValues.isAgentAvailable)
    ) {
      console.log(`Agent unavailable: skip request ${url}?${param}`);
      return;
    }

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

    addApiRequestHistory({
      method: 'GET',
      headers,
      url: `${backendUrl}${url}?${param}`,
      params: param,
    });

    fetch(`${backendUrl}${url}?${param}`, { method: 'GET', headers })
      .then(async (res) => {
        if (res.status === 400) {
          console.log('Agent Offline');
          throw 'Agent Offline';
        }
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
          setData(undefined);
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
        //if (addInHistory === true) {
        addApiResponseHistory({
          method: 'GET',
          url: `${backendUrl}${url}?${param}`,
          data: data,
          statusCode: statusCode,
          xProcessTime: res.xProcessTime,
        });
        //}
      })

      .catch((err) => {
        setFetching(false);
        setData(undefined);
        setError(true);
        if (err == 'Agent Offline') return;
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
