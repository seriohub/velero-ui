import { useApiPut } from '@/hooks/utils/useApiPut';

export const useUpdateBsl = () => {
  const {
    responseStatus,
    putData,
    fetching
  } = useApiPut();

  const handleUpdateBsl = async (values: any) => {
    try {
      // Execute the API call with the generic method
      await putData('/v1/bsl', { ...values });

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
    handleUpdateBsl,
    responseStatus,
    fetching,
  };
};
