import React, { createContext, useContext, useEffect, useState } from 'react';
import { AgentApiConfig } from '@/hooks/useAgentConfigs';

interface AgentStatus {
  agents: Array<AgentApiConfig> | null;
  currentAgent: AgentApiConfig | undefined;
  isAgentAvailable: Boolean | undefined;
  reload: number;
}
interface AgentStatusContextProps extends AgentStatus {
  setAgents: React.Dispatch<React.SetStateAction<Array<AgentApiConfig> | null>>;
  setCurrentAgent: React.Dispatch<React.SetStateAction<AgentApiConfig | undefined>>;
  setIsAgentAvailable: React.Dispatch<React.SetStateAction<Boolean | undefined>>;
  reloadAgents: React.Dispatch<React.SetStateAction<number>>;
}

const AgentStatusContext = createContext<AgentStatusContextProps | undefined>(undefined);

export const AgentStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // console.log('AgentStatusProvider');

  const [agents, setAgents] = useState<Array<AgentApiConfig> | null>(null);
  const [currentAgent, setCurrentAgent] = useState<AgentApiConfig | undefined>(undefined);
  const [isAgentAvailable, setIsAgentAvailable] = useState<Boolean | undefined>(undefined);
  const [reload, reloadAgents] = useState<number>(1);

  return (
    <AgentStatusContext.Provider
      value={{
        agents,
        currentAgent,
        isAgentAvailable,
        reload,
        setAgents,
        setCurrentAgent,
        setIsAgentAvailable,
        reloadAgents
      }}
    >
      {children}
    </AgentStatusContext.Provider>
  );
};

export const useAgentStatus = (): AgentStatusContextProps => {
  const context = useContext(AgentStatusContext);
  if (context === undefined) {
    throw new Error('AgentStatusContext must be used within an AgentStateProvider');
  }
  return context;
};
