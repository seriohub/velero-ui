import { useApiGet } from '@/hooks/utils/useApiGet';

export const useDownloadBackup = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const downloadBackup = async (resourceName: String) => {
    try {

      return await getData({
        url: '/v1/backup/download',
        params: `backup_name=${resourceName}`,
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
    downloadBackup,
    data,
    fetching,
    error,
  };
};
