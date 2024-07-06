// import { useContext } from 'react';

// import VeleroAppContexts from '@/contexts/VeleroAppContexts';
import { useAppState } from '@/contexts/AppStateContext';

interface UseApiGetProps {
  target?: 'core' | 'agent' | 'static';
}

export const useBackend = ({ target = 'agent' }: UseApiGetProps = {}) => {
  //const appValues = useContext(VeleroAppContexts);
  const appValues = useAppState()
  console.log(appValues)

  // const NEXT_PUBLIC_VELERO_API_URL = env('NEXT_PUBLIC_VELERO_API_URL');
  const NEXT_PUBLIC_VELERO_API_URL = appValues?.currentBackend?.url;

  const coreUrl = appValues.isCore
    ? target === 'core'
      ? '/core'
      : target === 'static'
        ? ''
        : `/agent/${appValues.currentAgent?.name}`
    : '';

  const backendUrl = `${NEXT_PUBLIC_VELERO_API_URL}${coreUrl}`;

  return backendUrl;
};
