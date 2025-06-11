import { useApiGet } from '@/hooks/utils/useApiGet';

export const useRepositoryLocks = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getRepositoryLocks = async (bsl: string, repositoryUrl: string) => {
    try {

      return await getData({
        url: '/v1/repo/locks',
        params: `bsl=${bsl}&repository_url=${repositoryUrl}`,
      });

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
    }
  };

  // Return the function for the call and the necessary data
  return {
    getRepositoryLocks,
    data,
    fetching,
    error,
  };
};
