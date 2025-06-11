import { useApiGet } from '@/hooks/utils/useApiGet';

export const useCreationScheduleSettings = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getCreationScheduleSettings = async () => {
    try {

      return await getData({ url: '/v1/schedule/environment' });

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
    }
  };

  // Return the function for the call and the necessary data
  return {
    getCreationScheduleSettings,
    data,
    fetching,
    error,
  };
};
