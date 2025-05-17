import { useApiPost } from '@/hooks/utils/useApiPost';

export const useSCCreateMap = () => {
  const {
    data,
    postData,
    fetching,
    error
  } = useApiPost();

  const handleScCreateMap = async (values: any) => {
    try {
      // Execute the API call with the generic method
      await postData('/v1/sc-mapping', {
        storageClassMapping: values,
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
    handleScCreateMap,
    responseStatus: data,
    fetching,
    error,
  };
};
