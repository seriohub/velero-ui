import { useApiGet } from '@/hooks/utils/useApiGet';

export const useBackupExpiration = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getBackupExpiration = async (resourceName: String) => {
    try {

      return await getData({
        url: '/v1/backup/expiration',
        params: `backup_name=${resourceName}`,
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
    getBackupExpiration,
    data,
    fetching,
    error,
  };
};
