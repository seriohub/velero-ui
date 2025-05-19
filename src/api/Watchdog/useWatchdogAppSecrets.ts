import { useApiGet } from '@/hooks/utils/useApiGet';

export const useWatchdogAppSecrets = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getWatchdogAppSecrets = async () => {
    try {

      return await getData({
        url: '/v1/watchdog/user/services',
        target: 'agent'
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
    getWatchdogAppSecrets,
    data,
    fetching,
    error,
  };
};
