import { env } from 'next-runtime-env';
import { useContext, useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAppState } from '@/contexts/AppStateContext';
import { useServerStatus } from '@/contexts/ServerStatusContext';

export const useAppWebSocket = () => {
  const appValues = useAppState();
  
  const [isServerAvailable, setIsServerAvailable] = useState(true);
  const [isAgentAvailable, setAgentIsAvailable] = useState(true);

  const NEXT_PUBLIC_VELERO_API_WS = appValues.currentServer?.ws;
  const socketUrl = `${NEXT_PUBLIC_VELERO_API_WS}/ws`;

  const didUnmount = useRef(false);
  const mounted = useRef(false);

  const jwtToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : '';

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => didUnmount.current === false,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    onOpen: () => {
      if (jwtToken) {
        console.log('WebSocket connected, sending JWT token.');
        sendMessage(jwtToken);
      }
      setIsServerAvailable(true);
    },
    onError: (event) => {
      console.error('WebSocket error observed:', event);
      setIsServerAvailable(false);
    },
    onClose: (event) => {
      console.log('WebSocket closed:', event);
      setIsServerAvailable(false);
    },
  }) //, isServerAvailable==true);  // Pass isServerAvailable as a dependency to only connect when true

  useEffect(() => {
    //if (!isServerAvailable) {
    //  return;
    //}

    if (lastMessage !== null) {
      // console.log(lastMessage, lastMessage.data)
      if (typeof lastMessage === 'object' && lastMessage.data !== undefined && typeof lastMessage.data === 'string') {
        const response = JSON.parse(lastMessage.data);
        appValues.setMessageHistory(appValues.messagesHistory.concat(lastMessage.data));
        if (response['response_type']=='agent_alive'){
          // console.log("Response agent ", response['agent_name'], "available", response['is_alive'])
          if (appValues.currentAgent?.name == response['agent_name'] && response['is_alive']){
            setAgentIsAvailable(true)
          }
          if (appValues.currentAgent?.name == response['agent_name'] && !response['is_alive']){
            setAgentIsAvailable(false)
          }
        }        
      }
    }
  }, [lastMessage, /*isServerAvailable*/]);

  useEffect(()=>{
    if (appValues.isCurrentServerControlPlane==false){
      setAgentIsAvailable(isServerAvailable==true)
    }
  }, [isServerAvailable])

  useEffect(()=>{
    if (appValues.currentAgent?.name == undefined){
      setAgentIsAvailable(false)
    }
  }, [appValues.currentServer, appValues.currentAgent])

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    if (mounted.current) {
      appValues.setSocketStatus(connectionStatus);
    }
  }, [connectionStatus]);

  useEffect(() => {
    return () => {
      didUnmount.current = true;
    };
  }, []);

  return {sendMessage, isServerAvailable, isAgentAvailable} ;
};
