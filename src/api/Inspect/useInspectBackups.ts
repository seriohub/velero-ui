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

      return await getData({
        url: '/v1/inspect/backups',
      });

    } catch (e) {
      // console.error('Error:', e);
    } finally {
      // This code will always be executed
    }
  };

  return {
    getInspectBackups,
    data,
    fetching,
    error,
  };
};
