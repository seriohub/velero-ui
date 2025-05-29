import { useApiPost } from '@/hooks/utils/useApiPost';

export const useRepositoryUnlock = () => {
  const {
    data,
    postData,
    fetching,
    error
  } = useApiPost();

  const getRepositoryUnlock = async (
    bsl: string,
    repositoryUrl: string,
    removeAll: boolean = false
  ) => {
    try {

      if (!removeAll) {
        return await postData('/v1/repo/unlock', {
          bsl,
          repositoryUrl,
          removeAll: false,
        });
      } else {
        return await postData('/v1/repo/unlock', {
          bsl,
          repositoryUrl,
          removeAll: true,
        });
      }

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
    }
  };

  // Return the function for the call and the necessary data
  return {
    getRepositoryUnlock,
    data,
    fetching,
    error,
  };
};
