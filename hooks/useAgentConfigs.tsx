import { useContext, useEffect } from 'react';
import VeleroAppContexts from '@/contexts/VeleroAppContexts';
import { useApiGet } from '@/hooks/useApiGet';

export interface AgentApiConfig {
  name: string;
  url: string;
  ws: string;
}

export const useAgentApiConfigs = () => {
  const appValues = useContext(VeleroAppContexts);

  const { data: dataAgent, getData: getDataAgent } = useApiGet({ target: 'core' });

  useEffect(() => {
    if (appValues.state.currentBackend !== undefined && appValues.state.isCore) {
      getDataAgent('/v1/cluster/get');
    }
  }, [appValues.state.currentBackend, appValues.state.isCore, appValues.state.online]);

  useEffect(() => {
    if (dataAgent !== undefined) {
      console.log('agents', dataAgent?.payload);
      appValues.setAgents(dataAgent?.payload);
      const agentIndex =
        localStorage.getItem('agent') &&
        Number(localStorage.getItem('agent')) < dataAgent?.payload.length
          ? Number(localStorage.getItem('agent'))
          : 0;
      appValues.setCurrentAgent(dataAgent?.payload[agentIndex]);
    }
  }, [dataAgent]);

  return;
};
