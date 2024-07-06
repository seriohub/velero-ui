import { useContext, useEffect } from 'react';
import VeleroAppContexts from '@/contexts/VeleroAppContexts';
import { useApiGet } from '@/hooks/useApiGet';

/*interface AgentApiConfig {
  name: string;
  url: string;
  ws: string;
}*/

export const useClusterConfigs = () => {
  const appValues = useContext(VeleroAppContexts);

  const { data, getData } = useApiGet();

  useEffect(() => {
    if (appValues.state.isCore == undefined) getData('/online');
  }, [appValues.state.isCore, appValues.state.online]);

  useEffect(() => {
    if (data?.payload !== undefined) {
      if (data?.payload?.type == 'control plane') {
        appValues.setIsCore(true);
      } else {
        appValues.setIsCore(false);
      }
    }
  }, [data]);

  return;
};
