import { useApiGet } from '@/hooks/utils/useApiGet';

export const useCreationBackupSettings = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getCreationBackupSettings = async () => {
    try {

      return await getData({
        url: '/v1/backup/environment',
        cache: true,
        ttl: 60000 * 10
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
    getCreationBackupSettings,
    data,
    fetching,
    error,
  };
};
