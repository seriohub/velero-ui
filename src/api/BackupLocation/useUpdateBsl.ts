import { useApiPut } from '@/hooks/utils/useApiPut';

export const useUpdateBsl = () => {
  const {
    responseStatus,
    putData,
    fetching
  } = useApiPut();

  const handleUpdateBsl = async (values: any) => {
    try {

      return await putData('/v1/bsl', { ...values });

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
    }
  };

  return {
    handleUpdateBsl,
    responseStatus,
    fetching,
  };
};
