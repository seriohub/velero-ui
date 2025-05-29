import { useApiGet } from '@/hooks/utils/useApiGet';

export const useAgentConfiguration = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getAgentConfiguration = async () => {
    try {

      return await getData({
        url: '/v1/settings/environment',
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
    getAgentConfiguration,
    data,
    fetching,
    error,
  };
};
