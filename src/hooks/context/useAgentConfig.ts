import { useEffect } from 'react';
// import { env } from 'next-runtime-env';
import { useAppStatus } from '@/contexts/AppContext';
import { useApiGet } from '@/hooks/utils/useApiGet';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentStatus } from '@/contexts/AgentContext';
import { useSocketStatus } from '@/contexts/SocketContext';
import { useAgentConfiguration } from '@/api/Agent/useAgentConfiguration';
// import { useAppInfo } from '@/api/App/useAppInfo';
// import { isRecordStringAny } from '@/utils/isRecordStringIsType';

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

  /*const {
    data: agentInfo,
    getAppInfo
  } = useAppInfo();*/
  const {
    data: agentConfiguration,
    getAgentConfiguration
  } = useAgentConfiguration();
  const {
    data: agentsAvailable,
    getData: getDataAgent
  } = useApiGet();

  // agent list if core connected
  useEffect(() => {
    if (serverValues.isCurrentServerControlPlane &&  appValues.isAuthenticated && appValues.isAuthenticated) {
      getDataAgent({
        url: '/v1/agents',
        target: 'core',
      });
    }
  }, [serverValues.isCurrentServerControlPlane, appValues.isAuthenticated, agentValues.reload]);

  // agent info and agent configuration
  useEffect(() => {
    /*if (agentValues.isAgentAvailable) {
      getAppInfo(serverValues.isCurrentServerControlPlane ? 'core' : 'agent');
    }*/
    if (agentValues.isAgentAvailable && appValues.isAuthenticated) {
      getAgentConfiguration();
    }
  }, [agentValues.isAgentAvailable, appValues.isAuthenticated]);

  // set

  // set initial agent
  useEffect(() => {
    if (serverValues.isCurrentServerControlPlane) {
      if (agentsAvailable !== undefined && Array.isArray(agentsAvailable)) {
        agentValues.setAgents(agentsAvailable);
        const agentIndex =
          localStorage.getItem('agent') &&
          Number(localStorage.getItem('agent')) < agentsAvailable?.length
            ? Number(localStorage.getItem('agent'))
            : 0;

        agentValues.setCurrentAgent(agentsAvailable[agentIndex]);
      }else{
        agentValues.setCurrentAgent(undefined);
      }
    }

    if (!serverValues.isCurrentServerControlPlane) {
      agentValues.setCurrentAgent(serverValues.currentServer);
    }
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
          const message =
            {
              type: "agent_alive",
              kind: "request",
              payload: {
                agent_name: agentValues.currentAgent?.name,
              },
              request_id: `req-${Date.now()}`,
              timestamp: new Date().toISOString(),
            };
          socketValues.sendMessageToSocket(JSON.stringify(message));
        }
      };
      checkAgentStatus();
      const interval = setInterval(checkAgentStatus, 8000);
      return () => clearInterval(interval);
    }
    if (!serverValues.isCurrentServerControlPlane) {
      agentValues.setIsAgentAvailable(serverValues.isServerAvailable);
    }

    return undefined;
  }, [
    agentValues.currentAgent,
    serverValues.isServerAvailable,
    serverValues.isCurrentServerControlPlane,
  ]);

  // agent configuration
  useEffect(() => {
    if (agentConfiguration !== undefined && typeof agentConfiguration === 'object') {
      agentValues.setAgentConfig(agentConfiguration);
    }
  }, [agentConfiguration]);

  // agent info
  /*useEffect(() => {
    if (agentInfo && isRecordStringAny(agentInfo)) {
      //agentValues.setAgentInfo(agentInfo);
    }
  }, [agentInfo]);*/
};
