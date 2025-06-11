import { useApiDelete } from '@/hooks/utils/useApiDelete';

export const useResourceDelete = () => {
  const {
    deleteData,
    fetching,
    error
  } = useApiDelete();

  const handleDeleteResource = async (resourceType: string, params: any) => {
    try {

      return await deleteData({
        url: `/v1/${resourceType}`,
        params,
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
    handleDeleteResource,
    fetching,
    error,
  };
};
