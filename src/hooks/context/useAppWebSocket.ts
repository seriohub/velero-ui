import { useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { useAppStatus } from '@/contexts/AppContext';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentStatus } from '@/contexts/AgentContext';
import { env } from 'next-runtime-env';
import { useAuthErrorHandler } from "@/hooks/user/useAuthErrorHandler";
import { eventEmitter } from '@/lib/EventEmitter.js';

const MAX_RECONNECT_ATTEMPTS = 20;
const RECONNECT_DELAY = 3000;

type UseAppWebSocketParams = {
  addSocketHistory: any;
};

export const useAppWebSocket = ({ addSocketHistory = null }: UseAppWebSocketParams) => {
  const appValues = useAppStatus();
  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();

  const { logout } = useAuthErrorHandler();
  const NEXT_PUBLIC_AUTH_ENABLED = env('NEXT_PUBLIC_AUTH_ENABLED')?.toLowerCase() !== 'false';

  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isConnectionFailed, setIsConnectionFailed] = useState(false);

  const didUnmount = useRef(false);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const readyStateRef = useRef(ReadyState.CONNECTING);

  const socketUrl = `${serverValues?.currentServer?.ws}/ws/auth`;
  const jwtToken: string = localStorage.getItem('token') ?? '';
  const isAuthenticated = Boolean(jwtToken);

  const {
    sendMessage,
    readyState
  } = useWebSocket(
    socketUrl,
    {
      shouldReconnect: () => !didUnmount.current && reconnectAttempts < MAX_RECONNECT_ATTEMPTS,
      reconnectAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectInterval: RECONNECT_DELAY,
      onOpen: () => {
        setReconnectAttempts(0);
        if (isAuthenticated) {
          sendMessage(JSON.stringify({
            type: 'authentication',
            kind: 'request',
            payload: { token: jwtToken }
          }));
        }
        serverValues.setIsServerAvailable(true);
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
        }
        heartbeatInterval.current = setInterval(() => {
          if (readyStateRef.current === ReadyState.OPEN) {
            sendMessage(JSON.stringify({
              type: 'ping',
              kind: 'request',
              request_id: "req-" + Date.now(),
              timestamp: new Date().toISOString()
            }));
          }
        }, 30000);
      },
      onMessage: (event) => {
        if (NEXT_PUBLIC_AUTH_ENABLED && !isAuthenticated) return;
        try {
          const response = JSON.parse(event.data);
          if (response.type === 'agent_alive' && agentValues.currentAgent?.name === response?.payload?.agent_name && response?.payload?.is_alive) {
            agentValues.setIsAgentAvailable(true);
          }
          if (response.type === 'agent_alive' && agentValues.currentAgent?.name === response?.payload?.agent_name && !response?.payload?.is_alive) {
            agentValues.setIsAgentAvailable(false);
          }
          if (response.type !== 'agent_alive' && response.type !== 'pong') {
            addSocketHistory?.((prev: string[]) => prev.concat(event.data));
          }
          if (response.type === 'user_watch' || response.type === 'global_watch') {
            eventEmitter.emit('watchResources', response);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      },
      onError: () => {
        setReconnectAttempts((prev) => prev + 1);
        serverValues.setIsServerAvailable(false);
        agentValues.setIsAgentAvailable(false);
      },
      onClose: (event) => {
        setReconnectAttempts((prev) => prev + 1);
        serverValues.setIsServerAvailable(false);
        agentValues.setIsAgentAvailable(false);

        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          setIsConnectionFailed(true);
          handleMaxReconnectFailure();
        }

        if (event?.code === 1001) {
          logout();
        }
      },
    },
    serverValues.currentServer !== undefined
  );

  const handleMaxReconnectFailure = () => {
    console.warn('Connection lost permanently. Logout.');
    logout();
  };

  useEffect(() => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      handleMaxReconnectFailure();
    }
  }, [reconnectAttempts]);

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

  useEffect(() => {
    readyStateRef.current = readyState;
  }, [readyState]);

  useEffect(
    () => () => {
      didUnmount.current = true;
    },
    []
  );

  return {
    sendMessage,
    isConnectionFailed
  };
};
