import { useApiGet } from '@/hooks/utils/useApiGet';

export const usePodVolumesRestore = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getPodVolumeRestores = async () => {
    try {

      return await getData({
        url: '/v1/pod-volume-restores',
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
    getPodVolumeRestores,
    data,
    fetching,
    error,
  };
};
