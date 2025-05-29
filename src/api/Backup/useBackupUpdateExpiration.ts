import { useApiPatch } from '@/hooks/utils/useApiPatch';

export const useBackupUpdateExpiration = () => {
  const {
    data,
    patchData,
    fetching,
    error
  } = useApiPatch();

  const backupUpdateExpiration = async (backupName: string, expiration: string) => {
    try {

      return await patchData('/v1/backup/expiration', {
        backupName,
        expiration,
      });

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
    }
  };

  // Return the function for the call and the necessary data
  return {
    backupUpdateExpiration,
    data,
    fetching,
    error,
  };
};
