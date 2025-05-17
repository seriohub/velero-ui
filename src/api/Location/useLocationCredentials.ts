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
      // Execute the API call with the generic method
      await getData({
        url: '/v1/location/credentials',
        params: `secret_name=${secretName}&secret_key=${secretKey}`,
      });

      // This code will be executed only in case of success
      // console.log('Request successful, execute final action...');
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
    getK8sCredential,
    data,
    fetching,
    error,
  };
};
