import { useApiGet } from '@/hooks/utils/useApiGet';

export const useVeleroSecretKey = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getVeleroSecretKey = async (secretName: string) => {
    try {

      return await getData({
        url: '/v1/k8s/velero/secret/key',
        params: `secret_name=${secretName}`,
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
    getVeleroSecretKey,
    data,
    fetching,
    error,
  };
};
