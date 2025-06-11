import { useApiPatch } from '@/hooks/utils/useApiPatch';

export const useSchedulesPause = () => {
  const {
    data,
    patchData,
    fetching,
    error
  } = useApiPatch();

  const schedulePause = async (resourceName: string) => {
    try {

      return await patchData('/v1/schedule/pause', { name: resourceName });

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
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
