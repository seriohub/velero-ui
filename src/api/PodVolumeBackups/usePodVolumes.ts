import { useApiGet } from '@/hooks/utils/useApiGet';

export const usePodVolumes = () => {
  const {
    data,
    getData,
    fetching,
    error,
    fetchedTime
  } = useApiGet();

  const getPodVolumes = async (type: string, forced: boolean = false) => {
    try {

      return await getData({
        url: type === 'PodVolumeBackup' ? '/v1/pod-volume-backups' : '/v1/pod-volume-restores',
        cache: true,
        force: forced,
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
    getPodVolumes,
    fetchedTime,
    data,
    fetching,
    error,
  };
};
