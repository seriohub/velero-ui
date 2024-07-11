import { env } from 'next-runtime-env';
import { useContext, useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAppState } from '@/contexts/AppStateContext';
import { useServerStatus } from '@/contexts/ServerStatusContext';
import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { usePathname } from 'next/navigation';

export const useAppWebSocket = () => {
  const appValues = useAppState();
  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();
  const pathname = usePathname();

  // const NEXT_PUBLIC_VELERO_API_WS = serverValues.currentServer?.ws;
  const socketUrl = appValues.isAuthenticated
    ? `${serverValues?.currentServer?.ws}/ws`
    : `${serverValues?.currentServer?.ws}/online`;
  
    // console.log("socketUrl", socketUrl)
  /*useEffect(() => {
    console.log("socketUrl", socketUrl)
  }, [appValues.isAuthenticated]);*/

  const didUnmount = useRef(false);
  const mounted = useRef(false);

  const jwtToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : '';

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => didUnmount.current === false,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    onOpen: () => {
      // console.log('WebSocket open');
      if (jwtToken) {
        console.log('WebSocket connected, sending JWT token.');
        sendMessage(jwtToken);
      }
      serverValues.setIsServerAvailable(true);
    },
    onError: (event) => {
      console.error('WebSocket error observed:', event);
      serverValues.setIsServerAvailable(false);
      agentValues.setIsAgentAvailable(false);
    },
    onClose: (event) => {
      console.log('WebSocket closed:', event);
      console.log('pathname', pathname);
      // if (pathname == '/login') return; // tmp workaround
      serverValues.setIsServerAvailable(false);
      agentValues.setIsAgentAvailable(false);
    },
  }, serverValues.currentServer!==undefined);  // Pass isServerAvailable as a dependency to only connect when true

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 1000 has been called ${lastMessage?.data}`, `color: green; font-weight: bold;`)
    // console.log('lastMessage', lastMessage);
    //if (!isServerAvailable) {
    //  return;
    //}

    if (lastMessage !== null) {
      // console.log(lastMessage, lastMessage.data)
      if (
        typeof lastMessage === 'object' &&
        lastMessage.data !== undefined &&
        typeof lastMessage.data === 'string'
      ) {
        const response = JSON.parse(lastMessage.data);

        if (response['response_type'] != 'agent_alive') {
          appValues.setMessageHistory(appValues.messagesHistory.concat(lastMessage.data));
        }

        if (response['response_type'] == 'agent_alive') {
          if (agentValues?.currentAgent?.name == response['agent_name'] && response['is_alive']) {
            agentValues.setIsAgentAvailable(true);
            console.log(`${response['agent_name']} available`);
          }
          if (agentValues.currentAgent?.name == response['agent_name'] && !response['is_alive']) {
            agentValues.setIsAgentAvailable(false);
            console.log(`${response['agent_name']} not available`);
          }
        }
      }
    }
  }, [lastMessage /*isServerAvailable*/]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 1100 has been called`, `color: green; font-weight: bold;`)
    console.log('connectionStatus', connectionStatus);
    if (mounted.current) {
      appValues.setSocketStatus(connectionStatus);
    }
  }, [connectionStatus]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 1200 has been called`, `color: green; font-weight: bold;`)
    console.log('didUnmount', didUnmount);
    return () => {
      didUnmount.current = true;
    };
  }, []);

  return { sendMessage };
};
