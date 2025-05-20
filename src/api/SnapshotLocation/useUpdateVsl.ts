import { useApiPut } from '@/hooks/utils/useApiPut';

export const useUpdateVsl = () => {
  const {
    responseStatus,
    putData,
    fetching
  } = useApiPut();

  const handleUpdateVsl = async (values: any) => {
    try {

      return await putData('/v1/vsl', { ...values });

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
      // console.log('Final action after request')
    }
  };

  return {
    handleUpdateVsl,
    responseStatus,
    fetching,
  };
};
