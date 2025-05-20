import { useApiPost } from '@/hooks/utils/useApiPost';

export const useCreateSchedule = () => {
  const {
    data,
    postData,
    fetching,
    error
  } = useApiPost();

  const handleCreateSchedule = async (values: any) => {
    try {

      return await postData('/v1/schedule', values);

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
    handleCreateSchedule,
    responseStatus: data,
    fetching,
    error,
  };
};
