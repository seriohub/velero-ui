import { useContext, useEffect } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { useApiGet } from '@/hooks/useApiGet';
import { useServerStatus } from '@/contexts/ServerStatusContext';
import { notifications } from '@mantine/notifications';
import { IconExclamationMark } from '@tabler/icons-react';

export interface AgentApiConfig {
  name: string;
  url: string;
  ws: string;
}

export const useAgentApiConfigs = () => {
  const appValues = useAppState();
  const isConnected = useServerStatus();

  const { data: dataAgent, getData: getDataAgent } = useApiGet();

  useEffect(() => {
    // console.log("appValues",appValues)
    if (appValues.currentServer !== undefined && appValues.isCurrentServerControlPlane!=undefined){
      if (appValues.isCurrentServerControlPlane) {
        getDataAgent({ url: '/v1/cluster/get', target: 'core' });
      } else {
        appValues.setCurrentAgent(appValues.currentServer);
      }
    }
  }, [appValues.currentServer, appValues.isCurrentServerControlPlane, isConnected]);

  useEffect(() => {
     console.log("dataAgent",dataAgent)
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
    if (dataAgent?.payload.length==0){
      notifications.show({
        icon: <IconExclamationMark />,
        color: 'red',
        title: 'Agents error',
        message: 'No agent registered in the control plane',
      });
    }
  }, [dataAgent]);

  return;
};
