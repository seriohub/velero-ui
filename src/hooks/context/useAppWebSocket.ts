import { useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAppStatus } from '@/contexts/AppContext';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentStatus } from '@/contexts/AgentContext';

import { useAuthErrorHandler } from '../user/useAuthErrorHandler';

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
        // console.log('WebSocket open');
        if (jwtToken) {
          //if (process.env.NODE_ENV === 'development') {
          // console.log('WebSocket connected, sending JWT token.');
          //}
          sendMessage(jwtToken);
        }
        serverValues.setIsServerAvailable(true);
        //if (process.env.NODE_ENV === 'development') {
        // console.log('Set server available');
        //}

        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
        }
        heartbeatInterval.current = setInterval(() => {
          // console.log('Checking WebSocket readyState:', readyStateRef.current);
          if (readyStateRef.current === ReadyState.OPEN) {
            // console.log('Sending heartbeat ping...');
            sendMessage(JSON.stringify({ action: 'ping' }));
          }
        }, 10000);
      },
      onError: () => {
        //if (process.env.NODE_ENV === 'development') {
        // console.error('WebSocket error observed:', event);
        //}

        serverValues.setIsServerAvailable(false);
        agentValues.setIsAgentAvailable(false);
        //if (process.env.NODE_ENV === 'development') {
        // console.log('Set server and agent not available');
        //}
      },
      onClose: (event) => {
        //if (process.env.NODE_ENV === 'development') {
        //console.log('WebSocket closed:', event);
        //}

        // if (pathname == '/login') return; // tmp workaround
        serverValues.setIsServerAvailable(false);
        agentValues.setIsAgentAvailable(false);
        //if (process.env.NODE_ENV === 'development') {
        //console.log('Set server and agent not available');
        //}

        if (event?.code === 1001) {
          //console.log('close', event?.code);
          logout();
        }
      },
    },
    serverValues.currentServer !== undefined
  ); // Pass isServerAvailable as a dependency to only connect when true

  useEffect(() => {
    if (lastMessage !== null) {
      // console.log(lastMessage, lastMessage.data)
      if (
        typeof lastMessage === 'object' &&
        lastMessage.data !== undefined &&
        typeof lastMessage.data === 'string'
      ) {
        const response = JSON.parse(lastMessage.data);

        if (response.type !== 'agent_alive' && response.type !== 'pong') {
          addSocketHistory((prev: string[]) => prev.concat(lastMessage.data));
        }

        if (response.type === 'agent_alive') {
          if (agentValues?.currentAgent?.name === response.agent_name && response.is_alive) {
            agentValues.setIsAgentAvailable(true);
            // if (process.env.NODE_ENV === 'development')
            // console.log(`${response.agent_name} available`);
          }
          if (agentValues.currentAgent?.name === response.agent_name && !response.is_alive) {
            agentValues.setIsAgentAvailable(false);
            // if (process.env.NODE_ENV === 'development') {
            // console.log(`${response.agent_name} not available`);
            // }
          }
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
    //if (mounted.current) {
    // if (process.env.NODE_ENV === 'development')
    // console.log('connectionStatus', connectionStatus);
    //}
    appValues.setSocketStatus(connectionStatus);
  }, [connectionStatus]);

  /*useEffect(() => {
    console.log('WebSocket ReadyState:', readyState);
    console.log('Connection status', connectionStatus);
  }, [readyState]);*/

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
