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
      await getData({
        url: '/v1/vui/pods'
      });
    } catch (e) {
      // console.error('Error:', e);
    } finally {
      // This code will always be executed
      // console.log('Final action after request')
    }
  };

  return {
    getVuiPods,
    data,
    fetching,
    error,
  };
};
