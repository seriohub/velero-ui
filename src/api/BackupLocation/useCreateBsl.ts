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
      await postData('/v1/bsl', values);
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
    handleCreateBsl,
    responseStatus: data,
    fetching,
    error,
  };
};
