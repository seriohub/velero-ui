import { useApiPost } from '@/hooks/utils/useApiPost';

export const useReconnectAgent = () => {
  const {
    data,
    postData,
    fetching,
    error
  } = useApiPost();

  const reconnectAgent = async () => {
    try {

      return await postData('/v1/nats/send-core-restarted', {}, 'core');

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
    }
  };

  // Return the function for the call and the necessary data
  return {
    reconnectAgent,
    data,
    fetching,
    error,
  };
};
