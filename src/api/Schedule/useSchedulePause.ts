import { useApiPatch } from '@/hooks/utils/useApiPatch';

export const useSchedulesPause = () => {
  const { data, patchData, fetching, error } = useApiPatch();

  const schedulePause = async (resourceName: string) => {
    try {
      // Execute the API call with the generic method
      await patchData('/v1/schedule/pause', { name: resourceName });

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
    schedulePause,
    data,
    fetching,
    error,
  };
};
