import { useApiGet } from '@/hooks/utils/useApiGet';

export const useClusterHealth = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getClusterHealth = async () => {
    try {

      return await getData({
        url: '/health/k8s',
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
    getClusterHealth,
    data,
    fetching,
    error,
  };
};
