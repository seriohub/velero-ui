import { useEffect } from 'react';

import { useAppStatus } from '@/contexts/AppContext';
import { useGithubRepoVersion } from '@/api/App/useGithubRepoVersion';
import { useAgentStatus } from '@/contexts/AgentContext';
import { useServerStatus } from '@/contexts/ServerContext';

export const useAppConfig = () => {
  const appValues = useAppStatus();
  const agentValues = useAgentStatus();
  const serverValues = useServerStatus();

  const { data: repoVersion, getRepoVersion } = useGithubRepoVersion();

  useEffect(() => {
    if (serverValues.isServerAvailable && serverValues.isCurrentServerControlPlane) {
      getRepoVersion('core');
    }

    if (agentValues.isAgentAvailable && !serverValues.isCurrentServerControlPlane) {
      getRepoVersion('agent');
    }
  }, [serverValues.isServerAvailable, agentValues.isAgentAvailable]);

  useEffect(() => {
    if (appValues.refreshGithubRepoVersion > 0) {
      if (serverValues.isServerAvailable && serverValues.isCurrentServerControlPlane) {
        getRepoVersion('core', true);
      }

      if (agentValues.isAgentAvailable && !serverValues.isCurrentServerControlPlane) {
        getRepoVersion('agent', true);
      }
    }
  }, [appValues.refreshGithubRepoVersion]);

  useEffect(() => {
    appValues.setRepoVersion(repoVersion?.payload);
  }, [repoVersion]);
};
