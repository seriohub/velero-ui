import { useApiGet } from '@/hooks/utils/useApiGet';

// Hook to handle category task fetching logic
export const useCheckRepository = () => {
  const { data, getData, fetching, error } = useApiGet();

  const checkRepository = async (
    repositoryURL: string,
    backupStorageLocation: string,
    repositoryName: string,
    repositoryType: string,
    volumeNamespace: string
  ) => {
    try {
      // Execute the API call with the generic method
      await getData({
        url: '/v1/repo/size',
        params: `repository_url=${repositoryURL}&backup_storage_location=${backupStorageLocation}&repository_name=${repositoryName}&repository_type=${repositoryType}&volume_namespace=${volumeNamespace}`,
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
    checkRepository,
    data,
    fetching,
    error,
  };
};
