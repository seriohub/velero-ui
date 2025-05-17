import { useApiDelete } from '@/hooks/utils/useApiDelete';

export const useResourceDelete = () => {
  const {
    deleteData,
    fetching,
    error
  } = useApiDelete();

  const handleDeleteResource = async (resourceType: string, params: any) => {
    try {
      // Execute the API call with the generic method
      await deleteData({
        url: `/v1/${resourceType}`,
        params,
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
    handleDeleteResource,
    fetching,
    error,
  };
};
