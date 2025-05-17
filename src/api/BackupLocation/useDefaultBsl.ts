import { useApiPost } from '@/hooks/utils/useApiPost';

export const useDefaultBsl = () => {
  const {
    data,
    postData,
    fetching,
    error
  } = useApiPost();

  const handleDefaultBsl = async (values: any) => {
    try {
      await postData('/v1/bsl/default', values);
    } catch (e) {
      // Error handling
    } finally {
      // This code will always be executed
    }
  };

  return {
    handleDefaultBsl,
    responseStatus: data,
    fetching,
    error,
  };
};
