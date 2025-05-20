import { useApiGet } from '@/hooks/utils/useApiGet';

export const useDownloadBackupRequests = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getDownloadBackupRequests = async () => {
    try {

      return await getData({
        url: '/v1/download-backup-requests',
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
    getDownloadBackupRequests,
    data,
    fetching,
    error,
  };
};
