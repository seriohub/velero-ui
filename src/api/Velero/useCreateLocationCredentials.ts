import { useApiPost } from '@/hooks/utils/useApiPost';

export const useCreateLocationCredentials = () => {
  const {
    data,
    postData,
    fetching,
    error
  } = useApiPost();

  const handleCreateCredentials = async (values: any) => {
    try {
      // Esegui la chiamata API con il metodo generico
      await postData('/v1/location/create-credentials', values);
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
    handleCreateCredentials,
    responseStatus: data,
    fetching,
    error,
  };
};
