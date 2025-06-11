import { useApiGet } from '@/hooks/utils/useApiGet';

export const useDeleteBackupRequests = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getDeleteBackupRequests = async () => {
    try {

      return await getData({
        url: '/v1/delete-backup-requests',
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
    getDeleteBackupRequests,
    data,
    fetching,
    error,
  };
};
