import { useApiGet } from '@/hooks/utils/useApiGet';

// Hook to handle category task fetching logic
export const useRepositoryUnlock = () => {
    const { data, getData, fetching, error } = useApiGet();

    const getRepositoryUnlock = async (repositoryUrl: string, removeAll: boolean = false) => {
        try {
            // Execute the API call with the generic method
            if (!removeAll)
                await getData({
                    url: '/v1/repo/unlock',
                    params: `repository_url=${repositoryUrl}`,
                });
            else
                await getData({
                    url: '/v1/repo/unlock',
                    params: `repository_url=${repositoryUrl}&remove_all=True`,
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
    return { getRepositoryUnlock, data, fetching, error };
};
