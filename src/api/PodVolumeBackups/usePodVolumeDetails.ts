import { useApiGet } from '@/hooks/utils/useApiGet';

export const usePodVolumeDetails = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getPodVolumeDetails = async (backup_name: string, type: string) => {
    try {

      return await getData({
        url: type === 'PodVolumeBackup' ? '/v1/pod-volume-backup' : '/v1/pod-volume-restore',
        params:
          type === 'PodVolumeBackup' ? `backup_name=${backup_name}` : `restore_name=${backup_name}`,
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
    getPodVolumeDetails,
    data,
    fetching,
    error,
  };
};
