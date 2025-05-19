/*'use client';

import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import AppShellLayout from '@/components/Layout/AppLayout/AppShell.Layout';
import { UserProvider } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/user/useAuth';

interface AppShellUserBootProps {
  children: any;
}

export default function AppShellUserRuntime({ children }: AppShellUserBootProps) {
  const { user } = useAuth();

  return (
    <UserProvider initialUser={user}>
      <Notifications autoClose={5000}/>
      <ModalsProvider>
        <AppShellLayout>{children}</AppShellLayout>
      </ModalsProvider>
    </UserProvider>
  );
}*/

'use client';

import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import AppShellLayout from '@/components/Layout/AppLayout/AppShell.Layout';
import { UserProvider, useUserStatus } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/user/useAuth';
import { useEffect } from "react";
import { env } from "next-runtime-env";

interface AppShellUserBootProps {
  children: any;
  reload: number;
}

function UserInitializer() {
  const { user: fetchedUser } = useAuth();
  const { setUser } = useUserStatus();

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  }, [fetchedUser]);

  return null;
}

function FakeUserInitializer() {
  const { setUser } = useUserStatus();

  useEffect(() => {
    setUser({
      id: 0,
      username: 'Guest',
      email: '- no guest email -',
    });
  }, []);

  return null;
}

export default function AppShellUserRuntime({ children }: AppShellUserBootProps) {
  const NEXT_PUBLIC_AUTH_ENABLED = env('NEXT_PUBLIC_AUTH_ENABLED')?.toLowerCase() !== 'false';
  return (
    <UserProvider>
      {NEXT_PUBLIC_AUTH_ENABLED && (<UserInitializer/>)}
      {!NEXT_PUBLIC_AUTH_ENABLED && (<FakeUserInitializer/>)}
      <Notifications autoClose={5000}/>
      <ModalsProvider>
        <AppShellLayout>{children}</AppShellLayout>
      </ModalsProvider>
    </UserProvider>
  );
}
