import React, { createContext, useContext, useState } from 'react';
import { AgentApiConfig } from '@/hooks/context/useAgentConfig';

interface AgentStatus {
  agents: Array<AgentApiConfig> | null;
  currentAgent: AgentApiConfig | undefined;
  isAgentAvailable: Boolean | undefined;
  reload: number;
  agentInfo: any;
  agentConfig: any;
}
interface AgentStatusContextProps extends AgentStatus {
  setAgents: React.Dispatch<React.SetStateAction<Array<AgentApiConfig> | null>>;
  setCurrentAgent: React.Dispatch<React.SetStateAction<AgentApiConfig | undefined>>;
  setIsAgentAvailable: React.Dispatch<React.SetStateAction<Boolean | undefined>>;
  reloadAgents: React.Dispatch<React.SetStateAction<number>>;
  setAgentInfo: React.Dispatch<React.SetStateAction<Array<any>>>;
  setAgentConfig: React.Dispatch<React.SetStateAction<Array<any>>>;
}

const AgentStatusContext = createContext<AgentStatusContextProps | undefined>(undefined);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Array<AgentApiConfig> | null>(null);
  const [currentAgent, setCurrentAgent] = useState<AgentApiConfig | undefined>(undefined);
  const [isAgentAvailable, setIsAgentAvailable] = useState<Boolean | undefined>(undefined);
  const [reload, reloadAgents] = useState<number>(1);
  const [agentInfo, setAgentInfo] = useState<any>([]);
  const [agentConfig, setAgentConfig] = useState<any>([]);

  return (
    <AgentStatusContext.Provider
      value={{
        agents,
        currentAgent,
        isAgentAvailable,
        reload,
        agentInfo,
        agentConfig,
        setAgents,
        setCurrentAgent,
        setIsAgentAvailable,
        reloadAgents,
        setAgentInfo,
        setAgentConfig,
      }}
    >
      {children}
    </AgentStatusContext.Provider>
  );
};

export const useAgentStatus = (): AgentStatusContextProps => {
  const context = useContext(AgentStatusContext);
  if (context === undefined) {
    throw new Error('useAgentStatus must be used within an AgentStateProvider');
  }
  return context;
};
