import { useApiGet } from '@/hooks/utils/useApiGet';

// Hook to handle category task fetching logic
export const useNatsClients = () => {
  const { data, getData, fetching, error } = useApiGet();

  const getNatsClients = async () => {
    try {
      // Execute the API call with the generic method
      await getData({
        url: '/v1/nats/clients/get',
        target: 'core',
      });

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
    getNatsClients,
    data,
    fetching,
    error,
  };
};
