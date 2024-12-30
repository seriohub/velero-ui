import { useState } from 'react';

import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentStatus } from '@/contexts/AgentContext';
import { useApiLogger } from '@/hooks/logger/useApiLogger';
import { useUserNotificationHistory } from '../user/useUserNotificationHistory';
import { useAuthErrorHandler } from '../user/useAuthErrorHandler';
import {
  ApiResponseShowErrorNotification,
} from '@/components/APIResponseNotification';
import { handleApiResponse } from './handleApiResponse';

type TargetType = 'core' | 'agent' | 'static';

type GetDataParams = {
  url: string;
  params?: string;
  addInHistory?: boolean;
  target?: TargetType;
};

export const useApiGet = () => {
  const { logout } = useAuthErrorHandler();

  const { addApiRequestHistory, addApiResponseHistory } = useApiLogger();
  const { addNotificationHistory } = useUserNotificationHistory();

  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();

  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<Record<string, any> | undefined>(undefined);
  const [error, setError] = useState(false);

  const getData = async ({
    url,
    params = '',
    addInHistory = true,
    target = 'agent',
  }: GetDataParams) => {

    if (error) {
      setError(false);
    }

    const coreUrl = serverValues.isCurrentServerControlPlane
      ? target === 'core'
        ? '/core'
        : target === 'static'
          ? ''
          : `/agent/${agentValues?.currentAgent?.name}`
      : '';

    const backendUrl = `${serverValues?.currentServer?.url}${coreUrl}`;

    if (!serverValues.isServerAvailable || serverValues.isServerAvailable == undefined) {
      console.log(`Server unavailable: skip request ${backendUrl}${url}?${params}`);
      return;
    }

    if (
      target == 'agent' &&
      url != '/online' &&
      (agentValues.currentAgent == undefined || !agentValues.isAgentAvailable)
    ) {
      console.log(`Agent unavailable: skip request ${url}?${params}`);
      return;
    }

    // Recupera il token JWT dal localStorage
    const jwtToken = localStorage.getItem('token');

    // Aggiungi il token JWT all'header, se presente
    const headers: any = {
      // 'Content-Type': 'application/json',
    };

    if (jwtToken) {
      headers.Authorization = `Bearer ${jwtToken}`;
    }

    if (addInHistory) {
    addApiRequestHistory({
      method: 'GET',
      headers,
      url: `${backendUrl}${url}?${params}`,
      params: params,
    });
  }

    setFetching(true);
    fetch(`${backendUrl}${url}?${params}`, { method: 'GET', headers })
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
        /*const data = res.data;
        const statusCode = res.status;

        if ('error' in data) {
          setData(undefined);
          setError(true);

          ApiResponseShowErrorNotification({
            title: data.error.title,
            message: data.error.description
          });          
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
            ApiResponseShowNotification({
              title: message.title,
              message: message.description,
              type: message?.info,
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
            APIResponseMessage({
              title: message.title,
              description: message.description,
            });
          });
        }

        setFetching(false);
        
        if (addInHistory === true) {
          addApiResponseHistory({
            method: 'GET',
            url: `${backendUrl}${url}?${param}`,
            data: data,
            statusCode: statusCode,
            xProcessTime: res.xProcessTime,
          });
        }*/
        setFetching(false);
        handleApiResponse({
          res,
          setData,
          setError,
          addNotificationHistory,
          addApiResponseHistory,
          addInHistory,
          backendUrl,
          url,
          params,
          method: 'GET',
        });
      })

      .catch((err) => {
        setFetching(false);
        setData(undefined);
        setError(true);
        ApiResponseShowErrorNotification({
          title: 'Error',
          message: `Oops, something went wrong. ${err}`,
        });
        if (err == 'Agent Offline') return;
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
