import { useApiGet } from '@/hooks/utils/useApiGet';

export const useServerStatusRequests = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getServerStatusRequests = async () => {
    try {

      return await getData({
        url: '/v1/server-status-requests',
        target: 'agent'
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
    getServerStatusRequests,
    data,
    fetching,
    error,
  };
};
