'use client';

import React, { createContext, useContext, useState } from 'react';
import { AgentApiConfig } from '@/hooks/context/useAgentConfig';

interface AgentStatus {
  agents: Array<AgentApiConfig> | null;
  currentAgent: AgentApiConfig | undefined;
  isAgentAvailable: Boolean | undefined;
  reload: number;
  agentInfo: any;
  agentConfig: any;
  k8sHealth: any;
  watchdogStatus: any;
  origins: any;
  arch: any;
  veleroInstalledVersion: any;
}

interface AgentStatusContextProps extends AgentStatus {
  setAgents: React.Dispatch<React.SetStateAction<Array<AgentApiConfig> | null>>;
  setCurrentAgent: React.Dispatch<React.SetStateAction<AgentApiConfig | undefined>>;
  setIsAgentAvailable: React.Dispatch<React.SetStateAction<Boolean | undefined>>;
  reloadAgents: React.Dispatch<React.SetStateAction<number>>;
  setAgentInfo: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setAgentConfig: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setK8sHealth: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setWatchdogStatus: React.Dispatch<React.SetStateAction<string | undefined>>;
  setOrigins: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setArch: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setVeleroInstalledVersion: any;
}

const AgentStatusContext = createContext<AgentStatusContextProps | undefined>(undefined);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Array<AgentApiConfig> | null>(null);
  const [currentAgent, setCurrentAgent] = useState<AgentApiConfig | undefined>(undefined);
  const [isAgentAvailable, setIsAgentAvailable] = useState<Boolean | undefined>(undefined);
  const [reload, reloadAgents] = useState<number>(1);
  const [agentInfo, setAgentInfo] = useState<any>([]);
  const [agentConfig, setAgentConfig] = useState<Record<string, any>>([]);
  const [k8sHealth, setK8sHealth] = useState<Record<string, any>>([]);
  const [watchdogStatus, setWatchdogStatus] = useState<string | undefined>(undefined);
  const [origins, setOrigins] = useState<Record<string, any>>([]);
  const [arch, setArch] = useState<Record<string, any>>([]);
  const [veleroInstalledVersion, setVeleroInstalledVersion] = useState<any>([]);

  return (
    <AgentStatusContext.Provider
      value={{
        agents,
        currentAgent,
        isAgentAvailable,
        reload,
        agentInfo,
        agentConfig,
        k8sHealth,
        watchdogStatus,
        origins,
        arch,
        veleroInstalledVersion,
        setAgents,
        setCurrentAgent,
        setIsAgentAvailable,
        reloadAgents,
        setAgentInfo,
        setAgentConfig,
        setK8sHealth,
        setWatchdogStatus,
        setOrigins,
        setArch,
        setVeleroInstalledVersion
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
