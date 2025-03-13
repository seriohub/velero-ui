import { useApiGet } from '@/hooks/utils/useApiGet';

export const useDownloadRequests = () => {
  const { data, getData, fetching, error } = useApiGet();

  const getDownloadRequests = async () => {
    try {
      // Execute the API call with the generic method
      await getData({
        url: '/v1/download-requests',
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
    getDownloadRequests,
    data,
    fetching,
    error,
  };
};
