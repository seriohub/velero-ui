import { useApiGet } from '@/hooks/utils/useApiGet';

export const useManifest = () => {
  const { data, getData, fetching, error } = useApiGet();

  const getManifest = async (resource_type: string, resource_name: string) => {
    try {
      // Execute the API call with the generic method
      await getData({
        url: '/v1/k8s/velero/manifest',
        params: `resource_type=${resource_type}&resource_name=${resource_name}`,
      });

      // This code will be executed only in case of success
      // console.log('Request successful, execute final action...');
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
    getManifest,
    data,
    fetching,
    error,
  };
};
