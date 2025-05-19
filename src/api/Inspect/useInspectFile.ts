import { useApiGet } from '@/hooks/utils/useApiGet';

export const useInspectFile = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getInspectFile = async (path: string): Promise<void> => {
    try {

      return await getData({
        url: '/v1/inspect/file',
        params: `path=${path}`,
      });

    } catch (e) {
      // console.error('Error:', e);
    } finally {
      // This code will always be executed
      // console.log('Final action after request')
    }
  };

  return {
    getInspectFile,
    data,
    fetching,
    error,
  };
};
