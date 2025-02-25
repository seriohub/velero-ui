'use client';

import { ServerError } from '@/components/Features/Errors/ServerError';

import AppShellBootAgent from './AppShell.BootAgent';

interface AppShellBootProps {
  children: any;
}

export default function AppShellBootConnection({ children }: AppShellBootProps) {
  return (
    <>
      <ServerError />
      <AppShellBootAgent>{children}</AppShellBootAgent>
    </>
  );
}
