import { useApiGet } from '@/hooks/utils/useApiGet';

export const useRepositoryCheck = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getRepositoryCheck = async (bsl: string, repositoryUrl: string) => {
    try {

      return await getData({
        url: '/v1/repo/check',
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
    getRepositoryCheck,
    data,
    fetching,
    error,
  };
};
