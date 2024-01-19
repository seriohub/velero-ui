import { env } from 'next-runtime-env';

import { useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const useAppWebSocket = () => {
  // Public API that will echo messages sent to it back to the client
  const NEXT_PUBLIC_VELERO_API_WS = env('NEXT_PUBLIC_VELERO_API_WS');

  //const [socketUrl, setSocketUrl] = useState(`${process.env.NEXT_PUBLIC_VELERO_API_WS}/ws`);
  const socketUrl = `${process.env.NEXT_PUBLIC_VELERO_API_WS}/ws`;

  const [messageHistory, setMessageHistory] = useState<Array<any>>([]);
  const didUnmount = useRef(false);

  const jwtToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : '';

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    //queryParams: {
    //  token: `${jwtToken}`,
    //},
    shouldReconnect: (closeEvent) => didUnmount.current === false,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      if (
        typeof lastMessage === 'object' &&
        lastMessage.data !== undefined &&
        typeof lastMessage.data === 'string'
      ) {
        setMessageHistory((prev) => prev.concat(lastMessage.data));
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

  return {
    // lastMessage,
    // connectionStatus,
    messageHistory,
  };
};
