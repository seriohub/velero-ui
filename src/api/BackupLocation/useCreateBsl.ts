import { useApiPost } from '@/hooks/utils/useApiPost';

export const useCreateBsl = () => {
  const { data, postData, fetching, error } = useApiPost();

  const handleCreateBsl = async (values: any) => {
    try {
      await postData('/v1/bsl', values);
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
    handleCreateBsl,
    responseStatus: data,
    fetching,
    error,
  };
};
