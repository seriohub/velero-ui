import { useApiPost } from '@/hooks/utils/useApiPost';

// Hook to handle category task fetching logic
export const useWatchdogRestart = () => {
  const { data, postData, fetching, error } = useApiPost();

  const watchdogRestart = async () => {
    try {
      // Execute the API call with the generic method
      await postData('/v1/watchdog/restart', {});
      //params: `email=${email}&slack=${slack}&telegram=${telegram}`
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
    watchdogRestart,
    data,
    fetching,
    error,
  };
};
