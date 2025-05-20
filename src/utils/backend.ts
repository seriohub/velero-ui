import { useServerStatus } from "@/contexts/ServerContext";
import { useAgentStatus } from "@/contexts/AgentContext";

export const buildBackendUrl = ({
                                  target = 'agent',
                                  serverValues,
                                  agentValues,
                                }: {
  target?: 'core' | 'agent' | 'static';
  serverValues: ReturnType<typeof useServerStatus>;
  agentValues: ReturnType<typeof useAgentStatus>;
}) => {
  let coreUrl = '';
  if (serverValues.isCurrentServerControlPlane) {
    if (target === 'core') {
      coreUrl = '/core';
    } else if (target === 'static') {
      coreUrl = '';
    } else {
      const agentName = agentValues?.currentAgent?.name;
      coreUrl = `/agent/${agentName}`;
    }
  }

  return `${serverValues?.currentServer?.url}${coreUrl}`;
};
