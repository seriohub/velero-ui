import { useApiDelete } from '@/hooks/utils/useApiDelete';

interface Service {
  name: string;
}

export const useWatchdogDeleteService = () => {
  const {
    data,
    deleteData,
    error
  } = useApiDelete();

  const watchdogDeleteService = async ({ name }: Service) => {
    try {

      return await deleteData({
        url: '/v1/watchdog/user/service',
        params: { name },
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
    watchdogDeleteService,
    data,
    error,
  };
};
