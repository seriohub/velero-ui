import { useApiPost } from '@/hooks/utils/useApiPost';

// Hook to handle category task fetching logic
export const useRepositoryUnlock = () => {
  const { data, postData, fetching, error } = useApiPost();

  const getRepositoryUnlock = async (
    bsl: string,
    repositoryUrl: string,
    removeAll: boolean = false
  ) => {
    try {
      // Execute the API call with the generic method
      if (!removeAll) {
        await postData('/v1/repo/unlock', {
          bsl,
          repositoryUrl,
          removeAll: false,
        });
      } else {
        await postData('/v1/repo/unlock', {
          bsl,
          repositoryUrl,
          removeAll: true,
        });
      }

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

  // Return the function for the call and the necessary data
  return {
    getRepositoryUnlock,
    data,
    fetching,
    error,
  };
};
