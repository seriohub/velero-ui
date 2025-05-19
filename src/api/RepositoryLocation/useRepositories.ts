import { useApiGet } from '@/hooks/utils/useApiGet';

export const useRepositories = () => {
  const {
    data,
    getData,
    fetching,
    error,
    fetchedTime
  } = useApiGet();

  const getRepositories = async (forced: boolean = false) => {
    try {

      return await getData({
        url: '/v1/repos',
        params: `forced=${forced}`,
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
    getRepositories,
    fetchedTime,
    data,
    fetching,
    error,
  };
};
