import { useApiPost } from '@/hooks/utils/useApiPost';

interface ChannelTest {
  config: string;
}

export const useWatchdogTestService = () => {
  const {
    data,
    postData,
    fetching,
    error
  } = useApiPost();

  const watchdogTestService = async ({ config }: ChannelTest) => {
    try {

      return await postData('/v1/watchdog/test-service', {
        config,
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
    watchdogTestService,
    data,
    fetching,
    error,
  };
};
