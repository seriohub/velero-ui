import { useApiGet } from '@/hooks/utils/useApiGet';

export const useCoreAgents = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getCoreAgents = async () => {
    try {

      return await getData({
        url: '/v1/agents',
        target: 'core',
      });

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
    getCoreAgents,
    data,
    fetching,
    error,
  };
};
