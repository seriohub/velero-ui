import { useApiPut } from '@/hooks/utils/useApiPut';

export const useUpdatePassword = () => {
  const {
    putData,
    responseStatus,
    fetching
  } = useApiPut();

  const handleUpdatePassword = async (password: string) => {
    try {

      return await putData('/v1/users/me/update/pwd', { password }, 'static');

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
    }
  };

  // Return the function for the call and the necessary data
  return {
    handleUpdatePassword,
    responseStatus,
    fetching,
  };
};
