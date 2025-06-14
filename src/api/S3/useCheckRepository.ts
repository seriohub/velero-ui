import { useApiGet } from '@/hooks/utils/useApiGet';

export const useCheckRepository = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const checkRepository = async (
    repositoryURL: string,
    backupStorageLocation: string,
    repositoryName: string,
    repositoryType: string,
    volumeNamespace: string
  ) => {
    try {

      return await getData({
        url: '/v1/repo/size',
        params: `repository_url=${repositoryURL}&backup_storage_location=${backupStorageLocation}&repository_name=${repositoryName}&repository_type=${repositoryType}&volume_namespace=${volumeNamespace}`,
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
    checkRepository,
    data,
    fetching,
    error,
  };
};
