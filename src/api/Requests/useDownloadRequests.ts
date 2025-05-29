import { useApiGet } from '@/hooks/utils/useApiGet';

export const useDownloadRequests = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getDownloadRequests = async () => {
    try {

      return await getData({
        url: '/v1/download-requests',
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
    getDownloadRequests,
    data,
    fetching,
    error,
  };
};
