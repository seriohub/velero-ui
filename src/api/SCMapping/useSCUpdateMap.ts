import { useApiPatch } from '@/hooks/utils/useApiPatch';

export const useSCUpdateMap = () => {
  const { data, patchData, fetching, error } = useApiPatch();

  const handleScUpdateMap = async (values: any) => {
    try {
      // Execute the API call with the generic method
      await patchData('/v1/sc-mapping', {
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
    handleScUpdateMap,
    responseStatus: data,
    fetching,
    error,
  };
};
