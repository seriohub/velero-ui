import { useApiGet } from '@/hooks/utils/useApiGet';

export const useCoreInfo = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getCoreInfo = async () => {
    try {

      return await getData({
        url: '/info/app',
        target: 'static',
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
    getCoreInfo,
    data,
    fetching,
    error,
  };
};
