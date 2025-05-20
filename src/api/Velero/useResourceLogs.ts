import { useApiGet } from '@/hooks/utils/useApiGet';

export const useResourceLogs = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getResourceLogs = async (resourceType: string, resourceName: string) => {
    try {

      return await getData({
        url: `/v1/${resourceType}/logs`,
        params: `resource_name=${resourceName}`,
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
    getResourceLogs,
    data,
    fetching,
    error,
  };
};
