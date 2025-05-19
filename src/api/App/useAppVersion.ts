import { useApiGet } from '@/hooks/utils/useApiGet';

export const useAppVersion = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getAppVersion = async () => {
    try {

      return await getData({
        url: '/v1/velero/version',
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
    getAppVersion,
    data,
    fetching,
    error,
  };
};
