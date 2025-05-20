import { useApiPut } from '@/hooks/utils/useApiPut';

export const useUpdateSchedule = () => {
  const {
    responseStatus,
    putData,
    fetching
  } = useApiPut();

  const handleUpdateSchedule = async (values: any) => {
    try {

      return await putData('/v1/schedule', { ...values });

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
