import { useApiGet } from '@/hooks/utils/useApiGet';

export const useRestores = () => {
  const {
    data,
    getData,
    fetching,
    error,
    fetchedTime
  } = useApiGet();

  const getRestores = async (forced: boolean = false) => {
    try {

      return await getData({
        url: '/v1/restores',
        params: `forced=${forced}`,
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
    getRestores,
    fetchedTime,
    data,
    fetching,
    error,
  };
};
