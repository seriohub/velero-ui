import { useEffect } from 'react';
import { useSocketStatus } from '@/contexts/SocketContext';

export function useWatchResources(plural: string) {
  const socketValues = useSocketStatus();

  useEffect(() => {
    const message = {
      action: 'watch',
      plural,
    };

    socketValues.sendMessageToSocket(JSON.stringify(message));
  }, [plural, socketValues]);

  return null;
}
