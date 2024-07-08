// import { useContext } from 'react';

// import { useAppState } from '@/contexts/AppStateContext';
import { useAppState } from '@/contexts/AppStateContext';

interface UseApiGetProps {
  target?: 'core' | 'agent' | 'static';
}

export const useBackend = ({ target = 'agent' }: UseApiGetProps = {}) => {
  //const appValues = useAppState();
  const appValues = useAppState()

  // const NEXT_PUBLIC_VELERO_API_URL = env('NEXT_PUBLIC_VELERO_API_URL');
  const NEXT_PUBLIC_VELERO_API_URL = appValues?.currentServer?.url;

  const coreUrl = appValues.isCurrentServerControlPlane
    ? target === 'core'
      ? '/core'
      : target === 'static'
        ? ''
        : `/agent/${appValues.currentAgent?.name}`
    : '';

  const backendUrl = `${NEXT_PUBLIC_VELERO_API_URL}${coreUrl}`;

  return backendUrl;
};
