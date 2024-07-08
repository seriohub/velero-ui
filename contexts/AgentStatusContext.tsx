import React, { createContext, useContext, useEffect } from 'react';
import { useAppState } from './AppStateContext';
import { useAppWebSocket } from '@/hooks/useAppWebSocket';

const ServerStatusContext = createContext();

export const AgentStatusProvider = ({ children }: any) => {
  const appValues = useAppState();

  const { sendMessage, isAgentAvailable } = useAppWebSocket();

  const checkAgentStatus = async () => {
    console.log("---", appValues?.isCurrentServerControlPlane)
    if (appValues.isCurrentServerControlPlane) {
      if (appValues.currentAgent?.name !== undefined) {
        console.log('Server is control plane. Request is agent available');
        const message = { request_type: 'agent_alive', agent_name: appValues.currentAgent?.name };
        sendMessage(JSON.stringify(message));
      }
    }
  };

  useEffect(() => {
    checkAgentStatus();
    const interval = setInterval(checkAgentStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
    checkAgentStatus()
  }, [appValues.isCurrentServerControlPlane, appValues.currentAgent])

  return (
    <ServerStatusContext.Provider value={isAgentAvailable}>{children}</ServerStatusContext.Provider>
  );
};

export const useAgentStatus = () => useContext(ServerStatusContext);
