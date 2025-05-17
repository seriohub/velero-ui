import { useApiGet } from '@/hooks/utils/useApiGet';

export const useInspectBackups = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getInspectBackups = async (): Promise<void> => {
    try {
      await getData({
        url: '/v1/inspect/backups',
      });
    } catch (e) {
      // console.error('Error:', e);
    } finally {
      // This code will always be executed
      // console.log('Final action after request')
    }
  };

  return {
    getInspectBackups,
    data,
    fetching,
    error,
  };
};
