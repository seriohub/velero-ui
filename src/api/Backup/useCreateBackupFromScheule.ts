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
      // Execute the API call with the generic method
      await postData('/v1/backup/create-from-schedule', { scheduleName: `${scheduleName}` });

      // This code will be executed only in case of success
      // console.log('Request successful, execute final action...');
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
