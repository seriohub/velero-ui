import { useApiPost } from '@/hooks/utils/useApiPost';

export const useCreateVsl = () => {
  const { data, postData, fetching, error } = useApiPost();

  const handleCreateVsl = async (values: any) => {
    try {
      await postData('/v1/vsl', values);
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
    handleCreateVsl,
    responseStatus: data,
    fetching,
    error,
  };
};
