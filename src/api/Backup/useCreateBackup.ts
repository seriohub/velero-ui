import { useApiPost } from '@/hooks/utils/useApiPost';

// Hook per gestire la logica di fetching dei task di categoria
export const useCreateBackup = () => {
  const { data, postData, fetching, error } = useApiPost();

  const handleCreateBackup = async (values: any) => {
    try {
      // Execute the API call with the generic method
      await postData('/v1/backup', values);
      // This code will be executed only in case of success
      // console.log('Richiesta riuscita, eseguo azioni finali...');
    } catch (e) {
      // Error handling
      // console.error('Errore durante la chiamata:', error);
    } finally {
      // This code will always be executed
      // console.log('Azione finale dopo la richiesta');
    }
  };

  return {
    handleCreateBackup,
    responseStatus: data,
    fetching,
    error,
  };
};
