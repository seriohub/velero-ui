import { useApiGet } from '@/hooks/utils/useApiGet';

export const useStats = () => {
  const {
    data,
    getData,
    fetching,
    fetchedTime,
    error
  } = useApiGet();

  const getStats = async (forced: boolean = false) => {
    try {

      return await getData({
        url: '/v1/stats',
        params: `forced=${forced}`,
        target: 'agent',
        cache: true,
        force: forced,
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
    getStats,
    data,
    fetching,
    fetchedTime,
    error,
  };
};
