'use client';

import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import { PublicEnvScript, env } from 'next-runtime-env';
import { theme } from '../theme';

import { ContextMenuProvider } from 'mantine-contextmenu';

import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/notifications/styles.layer.css';

import 'mantine-contextmenu/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import './layout.css';
import { ServerStatusProvider } from '@/contexts/ServerStatusContext';
import { AgentStatusProvider } from '@/contexts/AgentStatusContext';
import { AppStateProvider } from '@/contexts/AppStateContext';

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <PublicEnvScript nonce={{ headerKey: 'x-nonce' }} />
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
          <ServerStatusProvider>
            <AgentStatusProvider>
              <AppStateProvider>
                <ContextMenuProvider>{children}</ContextMenuProvider>
              </AppStateProvider>
            </AgentStatusProvider>
          </ServerStatusProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
