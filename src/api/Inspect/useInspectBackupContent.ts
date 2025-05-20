import { useApiGet } from '@/hooks/utils/useApiGet';

export const useInspectFolderContent = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getInspectFolderContent = async (backup: string): Promise<void> => {
    try {

      return await getData({
        url: '/v1/inspect/folder/content',
        params: `backup=${backup}`,
      });

    } catch (e) {
      // console.error('Error:', e);
    } finally {
      // This code will always be executed
      // console.log('Final action after request')
    }
  };

  return {
    getInspectFolderContent,
    data,
    fetching,
    error,
  };
};
