import { useApiGet } from '@/hooks/utils/useApiGet';

export const useVeleroTanzuVersion = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getVeleroTanzuVersion = async () => {
    try {

      return await getData({
        url: '/info/velero-repo-tag',
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
    getVeleroTanzuVersion,
    data,
    fetching,
    error,
  };
};
