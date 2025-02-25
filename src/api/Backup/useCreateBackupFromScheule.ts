import { useApiPost } from '@/hooks/utils/useApiPost';

export const useCreateBackupFromScheule = () => {
  const { data, postData, fetching, error } = useApiPost();

  const handleCreateBackupFromSchedule = async (scheduleName: string) => {
    try {
      // Execute the API call with the generic method
      await postData('/v1/backup/create-from-schedule', { scheduleName: `${scheduleName}` });

      // This code will be executed only in case of success
      // console.log('Richiesta riuscita, eseguo azioni finali...');
    } catch (e) {
      // Error handling
      // console.error('Errore durante la chiamata:', error);
    } finally {
      // This code will always be executed
      // console.log('Azione finale dopo la richiesta');
    }
  };

  return {
    handleCreateBackupFromSchedule,
    responseStatus: data,
    fetching,
    error,
  };
};
