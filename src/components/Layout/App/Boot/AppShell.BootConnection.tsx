'use client';

import { ServerError } from '@/components/ServerError/ServerError';

import { useAppWebSocket } from '@/hooks/context/useAppWebSocket';
import AppShellBootAgent from './AppShell.BootAgent';
import { useSocketStatus } from '@/contexts/SocketContext';

interface AppShellBootProps {
  children: any;
}

export default function AppShellBootConnection({ children }: AppShellBootProps) {
  // useAppWebSocket();
  //
  // const socketValues = useSocketStatus();
  return (
    <>
      <ServerError />
      <AppShellBootAgent>{children}</AppShellBootAgent>
    </>
  );
}
