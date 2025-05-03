'use client';

import { useEffect, useState } from 'react';
import { Center, Loader } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import AppShellLayout from '@/components/Layout/AppLayout/AppShell.Layout';
import { UserProvider } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/user/useAuth';

interface AppShellUserBootProps {
  children: any;
}

export default function AppShellUserBoot({ children }: AppShellUserBootProps) {
  const { user } = useAuth({ middleware: 'auth' });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !user) {
    return (
      <Center>
        <Loader color="red" size="lg" />
      </Center>
    );
  }

  return (
    <UserProvider initialUser={user}>
      <Notifications autoClose={5000} />
      <ModalsProvider>
        <AppShellLayout>{children}</AppShellLayout>
      </ModalsProvider>
    </UserProvider>
  );
}
