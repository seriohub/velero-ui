import { useAgentStatus } from '@/contexts/AgentContext';
import { useServerStatus } from '@/contexts/ServerContext';

interface UseApiGetProps {
  target?: 'core' | 'agent' | 'static';
}

export const useBackend = ({ target = 'agent' }: UseApiGetProps = {}) => {
  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();

  /*const coreUrl = serverValues.isCurrentServerControlPlane
    ? target === 'core'
      ? '/core'
      : target === 'static'
        ? ''
        : `/agent/${agentValues?.currentAgent?.name}`
    : '';*/
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
