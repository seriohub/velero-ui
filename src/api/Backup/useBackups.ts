import { useApiGet } from '@/hooks/utils/useApiGet';

// Hook to handle category task fetching logic
export const useBackups = () => {
    const { data, getData, fetching, error } = useApiGet();

    const getBackups = async (onlyLast4Schedule:boolean=true, forced:boolean=false) => {
        try {
            // Execute the API call with the generic method
            await getData({
                url: '/v1/backup/get',
                param: `only_last_for_schedule=${onlyLast4Schedule}&forced=${forced}`,
              });

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
    return { getBackups, data, fetching, error };
};
