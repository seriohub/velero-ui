import { useApiPost } from '@/hooks/utils/useApiPost';

export const useCreateBackupFromScheule = () => {
  const {
    data,
    postData,
    fetching,
    error
  } = useApiPost();

  const handleCreateBackupFromSchedule = async (scheduleName: string) => {
    try {

      return await postData('/v1/backup/create-from-schedule', { scheduleName: `${scheduleName}` });

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
      // console.log('Final action after request')
    }
  };

  return {
    handleCreateBackupFromSchedule,
    responseStatus: data,
    fetching,
    error,
  };
};
