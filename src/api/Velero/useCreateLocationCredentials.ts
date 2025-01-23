import { useApiPost } from '@/hooks/utils/useApiPost';

// Hook per gestire la logica di fetching dei task di categoria
export const useCreateLocationCredentials = () => {
  const { data, postData, fetching, error } = useApiPost();

  const handleCreateCredentials = async (values: any) => {
    try {
      // Esegui la chiamata API con il metodo generico
      await postData('/v1/location/create-credentials', values);
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
    handleCreateCredentials,
    responseStatus: data,
    fetching,
    error,
  };
};
