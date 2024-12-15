'use client';

import React from 'react';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import AppShellBoot from '@/components/Layout/App/AppShell.Boot';
import AppShellLayout from '@/components/Layout/App/AppShell.Layout';
import { UserProvider } from '@/contexts/UserContext';

export default function RootLayout({ children }: { children: any }) {
  return (
    <>
      <UserProvider initialUser={undefined}>
        <Notifications autoClose={5000} />
        <ModalsProvider>
          <AppShellBoot>{children}</AppShellBoot>
        </ModalsProvider>
      </UserProvider>
    </>
  );
}
