import { useApiGet } from '@/hooks/utils/useApiGet';

export const useVeleroSecrets = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getVeleroSecrets = async () => {
    try {

      return await getData({
        url: '/v1/k8s/velero/secrets',
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
    getVeleroSecrets,
    data,
    fetching,
    error,
  };
};
