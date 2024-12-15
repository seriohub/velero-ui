import { useApiPatch } from '@/hooks/utils/useApiPatch';

// Hook to handle category task fetching logic
export const useBackupUpdateExpiration = () => {
    const { data, patchData, fetching, error } = useApiPatch();

    const backupUpdateExpiration = async (backupName: string, expiration: string) => {
        try {
            // Execute the API call with the generic method
            await patchData('/v1/backup/update-expiration', { backup_name: backupName, expiration: expiration });

            // This code will be executed only in case of success
            // console.log('Request successful, execute final action...');
        } catch (error) {
            // Error handling
            // console.error('Error during call:', error);
        } finally {
            // This code will always be executed
            // console.log('Final action after request')
        }
    };

    // Return the function for the call and the necessary data
    return { backupUpdateExpiration, data, fetching, error };
};
