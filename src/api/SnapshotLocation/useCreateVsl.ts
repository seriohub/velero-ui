import { useApiPost } from '@/hooks/utils/useApiPost';

export const useCreateVsl = () => {
  const {
    data,
    postData,
    fetching,
    error
  } = useApiPost();

  const handleCreateVsl = async (values: any) => {
    try {

      return await postData('/v1/vsl', values);

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
      // console.log('Final action after request')
    }
  };

  return {
    handleCreateVsl,
    responseStatus: data,
    fetching,
    error,
  };
};
