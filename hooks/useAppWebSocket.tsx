import { env } from 'next-runtime-env';

import { useContext, useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';

export const useAppWebSocket = () => {
  const appValues = useContext(VeleroAppContexts);

  // Public API that will echo messages sent to it back to the client
  // const NEXT_PUBLIC_VELERO_API_WS = env('NEXT_PUBLIC_VELERO_API_WS');
  const NEXT_PUBLIC_VELERO_API_WS = appValues.state.currentBackend?.ws;

  //const [socketUrl, setSocketUrl] = useState(`${process.env.NEXT_PUBLIC_VELERO_API_WS}/ws`);
  const socketUrl = `${NEXT_PUBLIC_VELERO_API_WS}/ws`;

  // const [messageHistory, setMessageHistory] = useState<Array<any>>([]);
  const didUnmount = useRef(false);
  const mounted = useRef(false);

  const jwtToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : '';

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    //queryParams: {
    //  token: `${jwtToken}`,
    //},
    shouldReconnect: (closeEvent) => didUnmount.current === false,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    onOpen: () => {
      // "client ready"
      if (jwtToken) {
        console.log('WebSocket connected, sending JWT token.');
        sendMessage(jwtToken);
      }
    },
    onError: (event) => {
      console.error('WebSocket error observed:', event);
    },
    onClose: (event) => {
      console.log('WebSocket closed:', event);
    },
  });

  useEffect(() => {
    //console.log(lastMessage)
    if (lastMessage !== null) {
      if (
        typeof lastMessage === 'object' &&
        lastMessage.data !== undefined &&
        typeof lastMessage.data === 'string'
      ) {
        appValues.setMessageHistory(appValues.state.messagesHistory.concat(lastMessage.data));
        //setMessageHistory((prev) => prev.concat(lastMessage.data));
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

  mounted.current = true;

  if (!mounted) appValues.setSocketStatus(connectionStatus);

  return {};
};
