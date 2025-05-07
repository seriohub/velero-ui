import { useEffect } from 'react';

import { useAppStatus } from '@/contexts/AppContext';
import { useGithubRepoVersion } from '@/api/App/useGithubRepoVersion';
import { useAgentStatus } from '@/contexts/AgentContext';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAppInfo } from '@/api/App/useAppInfo';
import { isRecordStringAny } from "@/utils/isRecordStringIsType";

export const useAppConfig = () => {
  const appValues = useAppStatus();
  const agentValues = useAgentStatus();
  const serverValues = useServerStatus();

  const {
    data: appInfo,
    getAppInfo
  } = useAppInfo();

  const {
    data: repoVersion,
    getRepoVersion
  } = useGithubRepoVersion();

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
    appValues.setRepoVersion(repoVersion);
  }, [repoVersion]);

  useEffect(() => {
    if (serverValues.isServerAvailable) {
      getAppInfo();
    }
  }, [serverValues.isServerAvailable]);

  useEffect(() => {
    if (appInfo && isRecordStringAny(appInfo)) {
      appValues.setAppInfo(appInfo);
    }
  }, [appInfo]);
};
