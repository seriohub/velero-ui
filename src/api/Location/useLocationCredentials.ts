import { useApiGet } from '@/hooks/utils/useApiGet';

export const useLocationCredentials = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getK8sCredential = async (secretName: string, secretKey: string) => {
    try {

      return await getData({
        url: '/v1/location/credentials',
        params: `secret_name=${secretName}&secret_key=${secretKey}`,
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
    getK8sCredential,
    data,
    fetching,
    error,
  };
};
