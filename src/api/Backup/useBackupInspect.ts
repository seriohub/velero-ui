import { useApiGet } from '@/hooks/utils/useApiGet';

export const useInspectBackup = () => {
  const { data, getData, fetching, error } = useApiGet();

  const inspectBackup = async (resourceName: String) => {
    try {
      // Execute the API call with the generic method
      await getData({
        url: '/v1/backup/inspect-download',
        params: `backup_name=${resourceName}`,
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
    inspectBackup,
    data,
    fetching,
    error,
  };
};
