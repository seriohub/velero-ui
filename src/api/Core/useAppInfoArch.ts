import { useApiGet } from '@/hooks/utils/useApiGet';

export const useAppInfoArch = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getAppInfoArch = async () => {
    try {

      return await getData({
        url: '/info/arch',
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
    getAppInfoArch,
    data,
    fetching,
    error,
  };
};
