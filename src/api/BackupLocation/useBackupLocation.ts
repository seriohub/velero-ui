import { useApiGet } from '@/hooks/utils/useApiGet';

export const useBackupLocation = () => {
  const { data, getData, fetching, error, fetchedTime  } = useApiGet();

  const getBackupLocation = async (forced: boolean = false) => {
    try {
      // Execute the API call with the generic method
      await getData({
        url: '/v1/bsl',
        params: `forced=${forced}`,
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
    getBackupLocation,
    fetchedTime,
    data,
    fetching,
    error,
  };
};
