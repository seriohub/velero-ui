import { useApiGet } from '@/hooks/utils/useApiGet';

export const useAgentGHealthWatchdog = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getAgentHealthWatchdog = async () => {
    try {

      return await getData({
        url: '/health/watchdog',
        target: 'agent',
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
    getAgentHealthWatchdog,
    data,
    fetching,
    error,
  };
};
