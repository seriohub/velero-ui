import { useApiGet } from '@/hooks/utils/useApiGet';

export const useAgentInfo = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getAgentInfo = async () => {
    try {

      return await getData({
        url: '/info/app',
        target: 'agent',
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
    getAgentInfo,
    data,
    fetching,
    error,
  };
};
