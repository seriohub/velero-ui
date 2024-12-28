import { useApiGet } from '@/hooks/utils/useApiGet';

// Hook to handle category task fetching logic
export const useK8sConfigMap = () => {
    const { data, getData, fetching, error } = useApiGet();

    const getConfigMap = async (forced:boolean = false) => {
        try {
            // Execute the API call with the generic method
            await getData({ url: '/v1/sc/change-storage-classes-config-map/get' , params: `forced=${forced}`});

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
    return { getConfigMap, data, fetching, error };
};
