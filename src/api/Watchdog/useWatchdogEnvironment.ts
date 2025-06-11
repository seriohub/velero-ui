import { useApiGet } from '@/hooks/utils/useApiGet';

export const useWatchdogEnvironment = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getWatchdogConfig = async (forced: boolean = false) => {
    try {

      return await getData({
        url: '/v1/watchdog/environment',
        cache: true,
        force: forced,
      });

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
    }
  };

  // Return the function for the call and the necessary data
  return {
    getWatchdogConfig,
    data,
    fetching,
    error,
  };
};
