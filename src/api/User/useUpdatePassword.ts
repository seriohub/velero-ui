import { useApiPut } from '@/hooks/utils/useApiPut';

export const useUpdatePassword = () => {
  const { putData, responseStatus, fetching } = useApiPut({ target: 'static' });

  const handleUpdatePassword = async (password: string) => {
    try {
      // Execute the API call with the generic method
      await putData('/v1/users/me/update/pwd', { password });

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

  // Restituisci la funzione per la chiamata e i dati necessari
  return {
    handleUpdatePassword,
    responseStatus,
    fetching,
  };
};
