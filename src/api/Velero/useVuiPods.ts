import { useApiGet } from '@/hooks/utils/useApiGet';

export const useVuiPods = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getVuiPods = async (): Promise<void> => {
    try {

      return await getData({
        url: '/v1/vui/pods'
      });

    } catch (e) {
      // console.error('Error:', e);
    } finally {
      // This code will always be executed
    }
  };

  return {
    getVuiPods,
    data,
    fetching,
    error,
  };
};
