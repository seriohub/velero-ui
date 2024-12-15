'use client';

import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import { PublicEnvScript, env } from 'next-runtime-env';
import { theme } from '../../theme';

import { ContextMenuProvider } from 'mantine-contextmenu';

import '@mantine/charts/styles.css';
import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/notifications/styles.layer.css';

import 'mantine-contextmenu/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import './layout.css';
import { ServerStatusProvider } from '@/contexts/ServerStatusContext';
import { AgentStatusProvider } from '@/contexts/AgentStatusContext';
import { AppStateProvider, useAppState } from '@/contexts/AppStateContext';
import { UIStateProvider, useUIState } from '@/contexts/UIStateContext';

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <PublicEnvScript nonce={{ headerKey: 'x-nonce' }} />
        <ColorSchemeScript />
        <title>VUI - Velero UI</title>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <ServerStatusProvider>
          <AgentStatusProvider>
            <AppStateProvider>
              <UIStateProvider>
                <LayoutWithTheme>
                  <ContextMenuProvider>{children}</ContextMenuProvider>
                </LayoutWithTheme>
              </UIStateProvider>
            </AppStateProvider>
          </AgentStatusProvider>
        </ServerStatusProvider>
      </body>
    </html>
  );
}

// Componente che gestisce il tema dinamico
function LayoutWithTheme({ children }: { children: any }) {
  const { primaryColor, uiFontFamily, uiFontSize } = useUIState();

  return (
    <MantineProvider
      theme={{
        ...theme,
        primaryColor: primaryColor || 'blue',
        fontFamily: uiFontFamily.fontFamily?.style?.fontFamily,
        ...(uiFontSize !== undefined && { fontSizes: uiFontSize?.fontSize }),
      }}
    >
      <ContextMenuProvider>{children}</ContextMenuProvider>
    </MantineProvider>
  );
}
