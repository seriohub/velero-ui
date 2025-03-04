import { useApiPut } from '@/hooks/utils/useApiPut';

export const useUpdateSchedule = () => {
  const { responseStatus, putData, fetching } = useApiPut();

  const handleUpdateSchedule = async (values: any) => {
    try {
      // Execute the API call with the generic method
      await putData('/v1/schedule', { ...values });

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

  return {
    handleUpdateSchedule,
    responseStatus,
    fetching,
  };
};
