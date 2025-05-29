import { useApiGet } from '@/hooks/utils/useApiGet';

export const usePvcBackupSC = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getPvc = async (resourceName: string) => {
    try {

      return await getData({
        url: '/v1/backup/storage-classes',
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
    getPvc,
    data,
    fetching,
    error,
  };
};
