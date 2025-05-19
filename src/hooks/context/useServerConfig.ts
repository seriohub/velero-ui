'use client';

import { useEffect } from 'react';

import { useServerStatus } from '@/contexts/ServerContext';

import { useAppInfoOrigins } from "@/api/Core/useAppInfoOrigins";
import { useAppInfoArch } from "@/api/Core/useAppInfoArch";
import { useClusterHealth } from "@/api/Core/useClusterHealth";
import { useAppOnline } from "@/api/App/useAppOnline";

export const useServerConfig = () => {
  const serverValues = useServerStatus();

  const {
    getAppOnline
  } = useAppOnline();

  const {
    getAppInfoOrigins
  } = useAppInfoOrigins();

  const {
    getAppInfoArch
  } = useAppInfoArch();

  const {
    getClusterHealth
  } = useClusterHealth();

  // get backend index from localstorage
  useEffect(() => {
    const clusterIndex =
      localStorage.getItem('cluster') &&
      Number(localStorage.getItem('cluster')) < serverValues.servers.length
        ? Number(localStorage.getItem('cluster'))
        : 0;
    serverValues.setCurrentBackend(serverValues.servers[clusterIndex]);
  }, [serverValues.servers]);

  // get server data
  useEffect(() => {

    // get core info
    if (serverValues.isServerAvailable && serverValues.isCurrentServerControlPlane) {
      getAppInfoOrigins().then(response => {
        serverValues.setOrigins(response)
      });

      getAppInfoArch().then(response => {
        serverValues.setArch(response)
      })

      getClusterHealth().then(response => {
        serverValues.setK8sHealth(response)
      });
    }

    // get server info
    if (serverValues.isServerAvailable && serverValues.isCurrentServerControlPlane == undefined) {
      getAppOnline().then(response => {
        if (response?.type !== undefined) {
          if (response?.type === 'core' || response?.type === 'vui-common') {
            serverValues.setCurrentServerAsControlPlane(true);
          } else {
            serverValues.setCurrentServerAsControlPlane(false);
          }
        }
      });
    }
  }, [serverValues.isServerAvailable, serverValues.isCurrentServerControlPlane]);

  // set server settings
  useEffect(() => {
    const currentURL = new URL(window.location.href);
    serverValues.setUiURL(`${currentURL.protocol}//${currentURL.host}`);
    serverValues.setApiURL(`${serverValues?.currentServer?.url}`)
  }, [serverValues?.currentServer]);

};
