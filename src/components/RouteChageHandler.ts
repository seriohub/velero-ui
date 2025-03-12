'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSocketStatus } from '@/contexts/SocketContext';

const RouteChangeHandler = () => {
  const pathname = usePathname();
  const socketValues = useSocketStatus();

  useEffect(() => {
    const message = {
      action: 'watch:clear',
    };
    socketValues.sendMessageToSocket(JSON.stringify(message));
  }, [pathname]);

  return null;
};

export default RouteChangeHandler;
