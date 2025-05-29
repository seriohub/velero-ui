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

      return await postData('/v1/location/create-credentials', values);

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
    }
  };

  return {
    handleCreateCredentials,
    responseStatus: data,
    fetching,
    error,
  };
};
