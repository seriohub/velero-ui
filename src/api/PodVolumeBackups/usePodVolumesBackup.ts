import { useApiGet } from '@/hooks/utils/useApiGet';

export const usePodVolumesBackup = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getPodVolumeBackups = async () => {
    try {

      return await getData({
        url: '/v1/pod-volume-backups',
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
    getPodVolumeBackups,
    data,
    fetching,
    error,
  };
};
