import { useContext, useEffect } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { useApiGet } from '@/hooks/useApiGet';
import { useServerStatus } from '@/contexts/ServerStatusContext';

/*interface AgentApiConfig {
  name: string;
  url: string;
  ws: string;
}*/

export const useClusterConfigs = () => {
  const appValues = useAppState();
  const isConnected = useServerStatus();

  const { data, getData } = useApiGet();

  useEffect(() => {
    if (appValues.isCurrentServerControlPlane == undefined) getData({url:'/online', target:'static'});
  }, [appValues.isCurrentServerControlPlane, isConnected]);

  useEffect(() => {
    if (data?.payload !== undefined) {
      if (data?.payload?.type == 'control plane') {
        appValues.setCurrentServerAsControlPlane(true);
      } else {
        appValues.setCurrentServerAsControlPlane(false);
      }
    }
  }, [data]);

  return;
};
