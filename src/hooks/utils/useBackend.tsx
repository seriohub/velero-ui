// import { useContext } from 'react';

// import { useAppState } from '@/contexts/AppStateContext';
import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { useAppState } from '@/contexts/AppStateContext';
import { useServerStatus } from '@/contexts/ServerStatusContext';

interface UseApiGetProps {
  target?: 'core' | 'agent' | 'static';
}

export const useBackend = ({ target = 'agent' }: UseApiGetProps = {}) => {
  //const appValues = useAppState();
  
  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();

  // const NEXT_PUBLIC_VELERO_API_URL = env('NEXT_PUBLIC_VELERO_API_URL');
  // console.log(serverValues,agentValues)

  const coreUrl = serverValues.isCurrentServerControlPlane
    ? target === 'core'
      ? '/core'
      : target === 'static'
        ? ''
        : `/agent/${agentValues?.currentAgent?.name}`
    : '';

  const backendUrl = `${serverValues?.currentServer?.url}${coreUrl}`;

  return backendUrl;
};
