import { useAppStatus } from '@/contexts/AppContext';
import { useUserStatus } from '@/contexts/UserContext';

export function useUserNotificationHistory() {
  const appValue = useAppStatus();
  let userValues: any;

  try {
    userValues = useUserStatus();
  } catch {
    userValues = null; // Gestione del caso in cui il contesto non è inizializzato
  }

  const addNotificationHistory = (data: any) => {
    if (
      !appValue?.isAuthenticated ||
      !appValue?.isAppInitialized ||
      !appValue?.isUserLoaded ||
      !userValues
    ) {
      console.warn('addNotificationHistory not running: context not ready');
      return;
    }

    userValues.addNotificationHistory((prev: any[]) => prev.concat(data));
  };

  return { addNotificationHistory };
}
