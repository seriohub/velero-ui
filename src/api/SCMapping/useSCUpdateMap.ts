import { useApiPatch } from '@/hooks/utils/useApiPatch';

export const useSCUpdateMap = () => {
  const {
    data,
    patchData,
    fetching,
    error
  } = useApiPatch();

  const handleScUpdateMap = async (values: any) => {
    try {

      return await patchData('/v1/sc-mapping', {
        storageClassMapping: values,
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
    handleScUpdateMap,
    responseStatus: data,
    fetching,
    error,
  };
};
