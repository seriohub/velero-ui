import { useApiGet } from '@/hooks/utils/useApiGet';

export const useStorageClassesMap = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getStorageClassesMap = async (forced: boolean = false) => {
    try {

      return await getData({
        url: '/v1/sc-mapping',
        params: `forced=${forced}`,
        cache: true,
        force: forced
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
    getStorageClassesMap,
    data,
    fetching,
    error,
  };
};
