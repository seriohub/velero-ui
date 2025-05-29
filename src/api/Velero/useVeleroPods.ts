import { useApiGet } from '@/hooks/utils/useApiGet';

export const useVeleroPods = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getVeleroPods = async (): Promise<void> => {
    try {

      return await getData({
        url: '/v1/velero/pods'
      });

    } catch (e) {
      // console.error('Error:', e);
    } finally {
      // This code will always be executed
    }
  };

  return {
    getVeleroPods,
    data,
    fetching,
    error,
  };
};
