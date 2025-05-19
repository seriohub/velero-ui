import { useAgentStatus } from '@/contexts/AgentContext';
import { useServerStatus } from '@/contexts/ServerContext';
import { buildBackendUrl } from '@/utils/backend';

export const useBackend = ({ target = 'agent' }: { target?: 'core' | 'agent' | 'static' } = {}) => {
  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();

  return buildBackendUrl({
    target,
    serverValues,
    agentValues
  });
};
