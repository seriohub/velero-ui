import { useApiGet } from '@/hooks/utils/useApiGet';

export const usePodsLogs = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getPodLogs = async (podName: string, target: string = 'velero') => {
    try {

      return await getData({
        url: `/v1/k8s/pod/logs`,
        params: `pod=${podName}&target=${target}`,
      });

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
      // console.log('Final action after request')
    }
  };

  // Return the function for the call and the necessary data
  return {
    getPodLogs,
    data,
    fetching,
    error,
  };
};
