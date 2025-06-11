import { useApiGet } from '@/hooks/utils/useApiGet';

export const useCoreConfiguration = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getCoreConfiguration = async () => {
    try {

      return await getData({
        url: '/v1/settings/environment',
        target: 'core'
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
    getCoreConfiguration,
    data,
    fetching,
    error,
  };
};
