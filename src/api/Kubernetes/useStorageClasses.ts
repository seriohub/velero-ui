import { useApiGet } from '@/hooks/utils/useApiGet';

export const useStorageClasses = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getStorageClasses = async () => {
    try {

      return await getData({ url: '/v1/k8s/storage-classes' });

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
    }
  };

  // Return the function for the call and the necessary data
  return {
    getStorageClasses,
    data,
    fetching,
    error,
  };
};
