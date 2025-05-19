import { useApiPatch } from '@/hooks/utils/useApiPatch';

export const useSchedulesStart = () => {
  const {
    data,
    patchData,
    fetching,
    error
  } = useApiPatch();

  const scheduleStart = async (resourceName: string) => {
    try {

      return await patchData('/v1/schedule/unpause', { name: resourceName });

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
    scheduleStart,
    data,
    fetching,
    error,
  };
};
