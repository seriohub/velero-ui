import { useApiPut } from '@/hooks/utils/useApiPut';

export const useWatchdogUpdateConfigs = () => {
  const {
    responseStatus,
    putData,
    fetching
  } = useApiPut();

  const handleUpdateSchedule = async (values: any) => {
    try {

      return await putData('/v1/watchdog/user/configs', { ...values });

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
    handleUpdateSchedule,
    responseStatus,
    fetching,
  };
};
