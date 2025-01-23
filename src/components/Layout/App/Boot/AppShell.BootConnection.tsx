'use client';

import { ServerError } from '@/components/ServerError/ServerError';

import AppShellBootAgent from './AppShell.BootAgent';

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
