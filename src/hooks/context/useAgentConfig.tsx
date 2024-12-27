import { useEffect } from 'react';
import { useAppStatus } from '@/contexts/AppContext';
import { useApiGet } from '@/hooks/utils/useApiGet';
import { useServerStatus } from '@/contexts/ServerContext';
import { notifications } from '@mantine/notifications';
import { IconExclamationMark } from '@tabler/icons-react';
import { useAgentStatus } from '@/contexts/AgentContext';
import { useSocketStatus } from '@/contexts/SocketContext';

export interface AgentApiConfig {
  name: string;
  url: string;
  ws: string;
}

export const useAgentConfig = () => {
  const appValues = useAppStatus();
  const agentValues = useAgentStatus();
  const serverValues = useServerStatus();
  const socketValues = useSocketStatus(); 
  //const { sendMessage } = useAppWebSocket();

  const { data: dataAgent, getData: getDataAgent } = useApiGet();

  useEffect(() => {
    if (serverValues.isServerAvailable && serverValues.isCurrentServerControlPlane !== undefined) {
      if (serverValues.isCurrentServerControlPlane && appValues.isAuthenticated) {
        getDataAgent({ url: '/v1/agent/get', target: 'core' });
      } else {
        agentValues.setCurrentAgent(serverValues.currentServer);
        agentValues.setIsAgentAvailable(serverValues.isServerAvailable);
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
      agentValues.setAgents(dataAgent?.payload);
      const agentIndex =
        localStorage.getItem('agent') &&
        Number(localStorage.getItem('agent')) < dataAgent?.payload.length
          ? Number(localStorage.getItem('agent'))
          : 0;

      agentValues.setCurrentAgent(dataAgent?.payload[agentIndex]);
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
      const checkAgentStatus = async () => {
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
          //sendMessage(JSON.stringify(message));
          socketValues.sendMessage(JSON.stringify(message))
        }
      };
      checkAgentStatus();
      const interval = setInterval(checkAgentStatus, 8000);
      return () => clearInterval(interval);
    }
    if (serverValues.isCurrentServerControlPlane == false) {
      agentValues.setCurrentAgent(serverValues.currentServer);
      agentValues.setIsAgentAvailable(serverValues.isServerAvailable);
    }
  }, [agentValues.currentAgent, serverValues.isServerAvailable]);
};
