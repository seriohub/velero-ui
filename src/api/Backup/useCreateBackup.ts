import { useApiPost } from '@/hooks/utils/useApiPost';

export const useCreateBackup = () => {
  const {
    data,
    postData,
    fetching,
    error
  } = useApiPost();

  const handleCreateBackup = async (values: any) => {
    try {

      return await postData('/v1/backup', values);

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
    }
  };

  return {
    handleCreateBackup,
    responseStatus: data,
    fetching,
    error,
  };
};
