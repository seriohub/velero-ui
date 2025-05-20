import { useApiGet } from '@/hooks/utils/useApiGet';

export const useAppOnline = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getAppOnline = async () => {
    try {

      return await getData({
        url: '/online',
        target: 'static'
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
    getAppOnline,
    data,
    fetching,
    error,
  };
};
