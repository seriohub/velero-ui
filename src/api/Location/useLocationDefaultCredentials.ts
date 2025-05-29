import { useApiGet } from '@/hooks/utils/useApiGet';

export const useLocationDefaultCredentials = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getK8sDefaultCredential = async () => {
    try {

      return await getData({ url: '/v1/location/cloud-credentials' });

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
    }
  };

  // Return the function for the call and the necessary data
  return {
    getK8sDefaultCredential,
    data,
    fetching,
    error,
  };
};
