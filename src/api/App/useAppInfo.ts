import { useApiGet } from '@/hooks/utils/useApiGet';

type TargetType = 'core' | 'agent' | 'static';

export const useAppInfo = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getAppInfo = async (target: TargetType = 'static') => {
    try {

      return await getData({
        url: '/info/app',
        target,
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
    getAppInfo,
    data,
    fetching,
    error,
  };
};
