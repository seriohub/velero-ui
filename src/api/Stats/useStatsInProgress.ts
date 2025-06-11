import { useApiGet } from '@/hooks/utils/useApiGet';

export const useStatsInProgress = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getStatsInProgress = async (forced: boolean = false) => {
    try {

      return await getData({
        url: '/v1/stats/in-progress',
        addInHistory: false,
        target: 'agent',
        params: `forced=${forced}`,
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
    getStatsInProgress,
    data,
    fetching,
    error,
  };
};
