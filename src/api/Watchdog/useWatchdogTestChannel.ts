import { useApiGet } from '@/hooks/utils/useApiGet';

interface ChannelTest {
    email?: boolean,
    slack?: boolean,
    telegram?: boolean
}

// Hook to handle category task fetching logic
export const useWatchdogTestChannel = () => {
    const { data, getData, fetching, error } = useApiGet();

    const watchdogTestChannel = async ({
        email = false,
        slack = false,
        telegram = false
    }: ChannelTest) => {
        try {
            // Execute the API call with the generic method
            await getData({
                url: '/v1/watchdog/send-test-notification',
                params: `email=${email}&slack=${slack}&telegram=${telegram}`
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
    return { watchdogTestChannel, data, fetching, error };
};