import { useApiGet } from '@/hooks/utils/useApiGet';

type TargetType = 'core' | 'agent' | 'static';

export const useGithubRepoVersion = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getRepoVersion = async (target: TargetType, force: boolean = false) => {
    try {

      return await getData({
        url: '/info/vui-repo-tags',
        params: `force_scrapy=${force}`,
        target: 'static',
      });

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
    getRepoVersion,
    data,
    fetching,
    error,
  };
};
