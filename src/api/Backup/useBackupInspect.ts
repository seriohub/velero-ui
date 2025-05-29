import { useApiGet } from '@/hooks/utils/useApiGet';

export const useInspectBackup = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const inspectBackup = async (resourceName: String) => {
    try {

      return await getData({
        url: '/v1/backup/inspect-download',
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
    inspectBackup,
    data,
    fetching,
    error,
  };
};
