import { useEffect } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { useApiGet } from '@/hooks/utils/useApiGet';
import { useServerStatus } from '@/contexts/ServerStatusContext';
import { notifications } from '@mantine/notifications';
import { IconExclamationMark } from '@tabler/icons-react';
import { useAgentStatus } from '@/contexts/AgentStatusContext';

import { useAppWebSocket } from '../utils/useAppWebSocket';

export interface AgentApiConfig {
  name: string;
  url: string;
  ws: string;
}

export const useAgentApiConfigs = () => {
  const appValues = useAppState();
  const agentValues = useAgentStatus();
  const serverValues = useServerStatus();

  const { sendMessage } = useAppWebSocket();

  const { data: dataAgent, getData: getDataAgent } = useApiGet();

  // get agent list
  useEffect(() => {
    if (serverValues.isServerAvailable && serverValues.isCurrentServerControlPlane !== undefined) {
      if (process.env.NODE_ENV === 'development')
        console.log(`%cuseEffect 40 has been called`, `color: green; font-weight: bold;`);

      if (serverValues.isCurrentServerControlPlane && appValues.isAuthenticated) {
        getDataAgent({ url: '/v1/agent/get', target: 'core' });
      } else {
        agentValues.setCurrentAgent(serverValues.currentServer);
        agentValues.setIsAgentAvailable(serverValues.isServerAvailable);
        console.log(`30 Set agent available ${serverValues.isServerAvailable}`);
      }
    }
  }, [
    // serverValues.currentServer,
    serverValues.isCurrentServerControlPlane,
    // serverValues.isServerAvailable,
    agentValues.reload,
  ]);

  // set initial agent
  useEffect(() => {
    if (dataAgent !== undefined) {
      if (process.env.NODE_ENV === 'development')
        console.log(`%cuseEffect 50 has been called`, `color: green; font-weight: bold;`);
      // console.log("dataAgent",dataAgent)

      // console.log('agents', dataAgent?.payload);
      agentValues.setAgents(dataAgent?.payload);
      const agentIndex =
        localStorage.getItem('agent') &&
        Number(localStorage.getItem('agent')) < dataAgent?.payload.length
          ? Number(localStorage.getItem('agent'))
          : 0;

      agentValues.setCurrentAgent(dataAgent?.payload[agentIndex]);
      //checkAgentStatus();
    }
    if (dataAgent?.payload.length == 0) {
      notifications.show({
        icon: <IconExclamationMark />,
        color: 'red',
        title: 'Agents error',
        message: 'No agent registered in the core',
      });
    }
  }, [dataAgent]);

  useEffect(() => {
    if (serverValues.isCurrentServerControlPlane) {
      if (process.env.NODE_ENV === 'development')
        console.log(`%cuseEffect 60 has been called`, `color: green; font-weight: bold;`);

      const checkAgentStatus = async () => {
        // console.log('checkAgentStatus');
        if (
          serverValues.isServerAvailable &&
          serverValues.isCurrentServerControlPlane &&
          agentValues.currentAgent?.name !== undefined &&
          appValues.isAuthenticated
        ) {
          console.log(
            `Server is core type. Check ${agentValues.currentAgent?.name} agent is available`
          );
          const message = {
            request_type: 'agent_alive',
            agent_name: agentValues.currentAgent?.name,
          };
          sendMessage(JSON.stringify(message));
        }
      };
      checkAgentStatus();
      const interval = setInterval(checkAgentStatus, 8000);
      return () => clearInterval(interval);
    }
    if (serverValues.isCurrentServerControlPlane == false) {
      agentValues.setCurrentAgent(serverValues.currentServer);
      agentValues.setIsAgentAvailable(serverValues.isServerAvailable);
      console.log(`40 Set agent available ${serverValues.isServerAvailable}`);
    }
  }, [agentValues.currentAgent, serverValues.isServerAvailable]);
};
