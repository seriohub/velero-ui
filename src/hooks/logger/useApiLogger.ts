import { useAppStatus } from "@/contexts/AppContext";
import { useLoggerStatus } from "@/contexts/LoggerContext";

export function useApiLogger() {
    const appValues = useAppStatus();
    const loggerEnabled = process.env.NEXT_PUBLIC_LOGGER_ENABLED === 'true';

    if (!loggerEnabled) {
        return {
            addApiRequestHistory: () => { },
            addApiResponseHistory: (data: any) => { appValues.addXProcessTimer((prev) => prev.concat(data?.xProcessTime)) },
        };
    }

    const loggerValues = useLoggerStatus();

    const addApiRequestHistory = (data: any) => {
        loggerValues.addApiRequestHistory((prev) => prev.concat(data));
    };

    const addApiResponseHistory = (data: any) => {
        loggerValues.addApiResponseHistory((prev) => prev.concat(data));
        appValues.addXProcessTimer((prev) => prev.concat(data?.xProcessTime));
    };

    return { addApiRequestHistory, addApiResponseHistory };
}
