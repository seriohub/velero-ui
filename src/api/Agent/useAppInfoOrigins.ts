import { useApiGet } from '@/hooks/utils/useApiGet';

export const useAppInfoOrigins = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getAppInfoOrigins = async () => {
    try {

      return await getData({
        url: '/info/origins',
        target: 'agent',
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
    getAppInfoOrigins,
    data,
    fetching,
    error,
  };
};
