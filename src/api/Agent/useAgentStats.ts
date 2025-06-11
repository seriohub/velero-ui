import { useApiGet } from '@/hooks/utils/useApiGet';

export const useAgentStats = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getAgentStats = async (forced: boolean = false) => {
    try {

      return await getData({
        url: '/v1/agents/health',
        target: 'core',
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
    getAgentStats,
    data,
    fetching,
    error,
  };
};
