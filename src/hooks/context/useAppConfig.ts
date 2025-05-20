'use client';

import { useEffect } from 'react';

import { useAppStatus } from '@/contexts/AppContext';
import { useGithubRepoVersion } from '@/api/App/useGithubRepoVersion';
import { useAgentStatus } from '@/contexts/AgentContext';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAppInfo } from '@/api/App/useAppInfo';
import { useVeleroTanzuVersion } from "@/api/App/useVeleroTanzuVersion";

export const useAppConfig = () => {
  const appValues = useAppStatus();
  const agentValues = useAgentStatus();
  const serverValues = useServerStatus();

  const {
    getAppInfo
  } = useAppInfo();

  const {
    data: repoVersion,
    getRepoVersion
  } = useGithubRepoVersion();

  const {
    getVeleroTanzuVersion
  } = useVeleroTanzuVersion();

  useEffect(() => {
    if (appValues.isAuthenticated) {
      if (serverValues.isServerAvailable && serverValues.isCurrentServerControlPlane) {
        getRepoVersion('core');
      }

      if (agentValues.isAgentAvailable && !serverValues.isCurrentServerControlPlane) {
        getRepoVersion('agent');
      }
    }
  }, [serverValues.isServerAvailable, agentValues.isAgentAvailable, appValues.isAuthenticated]);

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
    if (serverValues.isServerAvailable && appValues.isAuthenticated) {
      // getAppInfo();
      getVeleroTanzuVersion().then(response => {
        appValues.setVeleroTanzuVersion(response)
      });
    }
    if (serverValues.isServerAvailable) {
      getAppInfo().then(response => {
        appValues.setAppInfo(response);
      });
    }
  }, [serverValues.isServerAvailable, appValues.isAuthenticated]);

};
