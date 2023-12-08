'use client';

import '@mantine/core/styles.css';
// import '@mantine/core/styles.layer.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.layer.css';
// import './global.css'
// import './layout.css';

import React, { useState } from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { PublicEnvScript, PublicEnvProvider } from 'next-runtime-env';
import { theme } from '../theme';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';

import AppShellLayout from '@/components/Layout/AppShell.Layout';

export default function RootLayout({ children }: { children: any }) {
  const [appApiHistory, setAppApiHistory] = useState<Array<any>>([]);

  return (
    <html lang="en">
      <head>
        <PublicEnvScript />
        <ColorSchemeScript />
        <title>Velero</title>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <VeleroAppContexts.Provider
            value={{
              state: {
                apiHistory: appApiHistory,
              },
              setApiHistory: setAppApiHistory,
            }}
          >
            <Notifications />
            <ModalsProvider>
              <AppShellLayout>
                <PublicEnvProvider>{children}</PublicEnvProvider>
              </AppShellLayout>
            </ModalsProvider>
          </VeleroAppContexts.Provider>
        </MantineProvider>
      </body>
    </html>
  );
}
