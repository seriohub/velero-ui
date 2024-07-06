'use client';

import React from 'react';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import AppShellBoot from '@/components/Layout/App/AppShell.Boot';
import AppShellLayout from '@/components/Layout/App/AppShell.Layout';


export default function RootLayout({ children }: { children: any }) {
  return (
    <>
      <Notifications autoClose={5000}/>
      <ModalsProvider>
        <>
        {/*<AppShellLayout>{children}</AppShellLayout>*/}
        <AppShellBoot>{children}</AppShellBoot>
        </>
      </ModalsProvider>
    </>
  );
}
