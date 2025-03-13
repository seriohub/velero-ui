import { useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAppStatus } from '@/contexts/AppContext';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentStatus } from '@/contexts/AgentContext';

import { useAuthErrorHandler } from '../user/useAuthErrorHandler';
import { eventEmitter } from '@/lib/EventEmitter.js';

type UseAppWebSocketParams = {
  addSocketHistory: any;
};

export const useAppWebSocket = ({ addSocketHistory = null }: UseAppWebSocketParams) => {
  const appValues = useAppStatus();
  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();

  const { logout } = useAuthErrorHandler();

  const socketUrl = `${serverValues?.currentServer?.ws}/ws/auth`;

  const didUnmount = useRef(false);
  // const mounted = useRef(false);

  const jwtToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : '';

  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const readyStateRef = useRef(ReadyState.CONNECTING);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    socketUrl,
    {
      shouldReconnect: () => !didUnmount.current,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
      onOpen: () => {
        if (jwtToken) {
          sendMessage(jwtToken);
        }
        serverValues.setIsServerAvailable(true);
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
        }
        heartbeatInterval.current = setInterval(() => {
          if (readyStateRef.current === ReadyState.OPEN) {
            sendMessage(JSON.stringify({ action: 'ping' }));
          }
        }, 10000);
      },
      onError: () => {
        serverValues.setIsServerAvailable(false);
        agentValues.setIsAgentAvailable(false);
      },
      onClose: (event) => {
        serverValues.setIsServerAvailable(false);
        agentValues.setIsAgentAvailable(false);

        if (event?.code === 1001) {
          logout();
        }
      },
    },
    serverValues.currentServer !== undefined
  ); // Pass isServerAvailable as a dependency to only connect when true

  useEffect(() => {
    if (lastMessage !== null) {
      if (
        typeof lastMessage === 'object' &&
        lastMessage.data !== undefined &&
        typeof lastMessage.data === 'string'
      ) {
        const response = JSON.parse(lastMessage.data);

        if (response.type !== 'agent_alive' && response.type !== 'pong') {
          addSocketHistory((prev: string[]) => prev.concat(lastMessage.data));
        }

        /*if (response.type === 'agent_alive') {
          if (agentValues?.currentAgent?.name === response.agent_name && response.is_alive) {
            agentValues.setIsAgentAvailable(true);
          }
          if (agentValues.currentAgent?.name === response.agent_name && !response.is_alive) {
            agentValues.setIsAgentAvailable(false);
          }
        }*/

        if (response.type === 'user_watch' || response.type === 'global_watch') {
          eventEmitter.emit('watchResources', response);
        }
      }
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    appValues.setSocketStatus(connectionStatus);
  }, [connectionStatus]);

  // Aggiorna il valore di readyStateRef ogni volta che cambia
  useEffect(() => {
    readyStateRef.current = readyState;
  }, [readyState]);

  useEffect(
    () => () => {
      didUnmount.current = true;
    },
    []
  );

  return { sendMessage };
};
