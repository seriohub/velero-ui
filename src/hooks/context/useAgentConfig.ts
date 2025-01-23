import { useEffect } from 'react';
import { useAppStatus } from '@/contexts/AppContext';
import { useApiGet } from '@/hooks/utils/useApiGet';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentStatus } from '@/contexts/AgentContext';
import { useSocketStatus } from '@/contexts/SocketContext';
import { useAgentConfiguration } from '@/api/Agent/useAgentConfiguration';
import { useAppInfo } from '@/api/App/useAppInfo';

export interface AgentApiConfig {
  name: string;
  url: string;
  ws: string;
}

export const useAgentConfig = () => {
  const appValues = useAppStatus();
  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();
  const socketValues = useSocketStatus();

  const { data: agentInfo, getAppInfo } = useAppInfo();
  const { data: agentConfiguration, getAgentConfiguration } = useAgentConfiguration();
  const { data: agentsAvailable, getData: getDataAgent } = useApiGet();

  // get

  // agent list if core connected
  useEffect(() => {
    //if (serverValues.isServerAvailable && serverValues.isCurrentServerControlPlane !== undefined) {
    if (serverValues.isCurrentServerControlPlane && appValues.isAuthenticated) {
      getDataAgent({
        url: '/v1/agents',
        target: 'core',
      });
    } // else {
    // agentValues.setCurrentAgent(serverValues.currentServer);
    // agentValues.setIsAgentAvailable(serverValues.isServerAvailable);
    // }
    //}
  }, [
    // serverValues.currentServer,
    serverValues.isCurrentServerControlPlane,
    // serverValues.isServerAvailable,
    appValues.isAuthenticated,
    agentValues.reload,
  ]);

  // agent info and agent configuration
  useEffect(() => {
    if (agentValues.isAgentAvailable) {
      getAppInfo(serverValues.isCurrentServerControlPlane ? 'core' : 'agent');
    }
    if (agentValues.isAgentAvailable && appValues.isAuthenticated) {
      getAgentConfiguration();
    }
  }, [agentValues.isAgentAvailable, appValues.isAuthenticated]);

  // set

  // set initial agent
  useEffect(() => {
    if (serverValues.isCurrentServerControlPlane) {
      if (agentsAvailable !== undefined) {
        agentValues.setAgents(agentsAvailable?.payload);
        const agentIndex =
          localStorage.getItem('agent') &&
          Number(localStorage.getItem('agent')) < agentsAvailable?.payload.length
            ? Number(localStorage.getItem('agent'))
            : 0;

        agentValues.setCurrentAgent(agentsAvailable?.payload[agentIndex]);
      }
    }

    if (!serverValues.isCurrentServerControlPlane) {
      agentValues.setCurrentAgent(serverValues.currentServer);
    }
    /*if (dataAgent?.payload.length == 0) {
      notifications.show({
        icon: <IconExclamationMark />,
        color: 'red',
        title: 'Agents error',
        message: 'No agent registered in the core',
      });
    }*/
  }, [agentsAvailable, serverValues.isCurrentServerControlPlane]);

  // agent available
  useEffect(() => {
    if (serverValues.isCurrentServerControlPlane) {
      const checkAgentStatus = async () => {
        if (
          serverValues.isServerAvailable &&
          serverValues.isCurrentServerControlPlane &&
          // agentValues.currentAgent?.name !== undefined &&
          appValues.isAuthenticated
        ) {
          console.log(
            `Server is core type. Send a request to confirm ${agentValues.currentAgent?.name}'s availability.`
          );
          const message = {
            request_type: 'agent_alive',
            agent_name: agentValues.currentAgent?.name,
          };
          // sendMessage(JSOsendMessageToSocket.stringify(message));
          socketValues.sendMessageToSocket(JSON.stringify(message));
        }
      };
      checkAgentStatus();
      const interval = setInterval(checkAgentStatus, 8000);
      return () => clearInterval(interval);
    }
    if (!serverValues.isCurrentServerControlPlane) {
      // agentValues.setCurrentAgent(serverValues.currentServer);
      agentValues.setIsAgentAvailable(serverValues.isServerAvailable);
    }
  }, [
    agentValues.currentAgent,
    serverValues.isServerAvailable,
    serverValues.isCurrentServerControlPlane,
  ]);

  // agent configuration
  useEffect(() => {
    if (agentConfiguration !== undefined) {
      agentValues.setAgentConfig(agentConfiguration?.payload);
    }
  }, [agentConfiguration]);

  // agent info
  useEffect(() => {
    if (agentInfo) {
      agentValues.setAgentInfo(agentInfo?.payload);
    }
  }, [agentInfo]);
};
