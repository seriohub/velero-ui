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
      // Execute the API call with the generic method
      await getData({
        url: `/v1/k8s/pod/logs`,
        params: `pod=${podName}&target=${target}`,
      });

      // This code will be executed only in case of success
      // console.log('Request successful, execute final action...');
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
