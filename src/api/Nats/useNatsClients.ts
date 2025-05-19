import { useApiGet } from '@/hooks/utils/useApiGet';

export const useNatsClients = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getNatsClients = async () => {
    try {

      return await getData({
        url: '/v1/nats/clients',
        target: 'core',
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
    getNatsClients,
    data,
    fetching,
    error,
  };
};
