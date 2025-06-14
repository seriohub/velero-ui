import { useApiGet } from '@/hooks/utils/useApiGet';

export const useWatchdogAppConfigs = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getWatchdogAppConfigs = async (forced: boolean = false) => {
    try {

      return await getData({
        url: '/v1/watchdog/user/configs',
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
    getWatchdogAppConfigs,
    data,
    fetching,
    error,
  };
};
