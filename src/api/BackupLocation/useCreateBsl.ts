import { useApiPost } from '@/hooks/utils/useApiPost';

export const useCreateBsl = () => {
  const {
    data,
    postData,
    fetching,
    error
  } = useApiPost();

  const handleCreateBsl = async (values: any) => {
    try {

      return await postData('/v1/bsl', values);

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
      // console.log('Final action after request')
    }
  };

  return {
    handleCreateBsl,
    responseStatus: data,
    fetching,
    error,
  };
};
