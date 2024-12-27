'use client';

import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import { PublicEnvScript } from 'next-runtime-env';
import { theme } from '../../theme';

import { ContextMenuProvider } from 'mantine-contextmenu';

import '@mantine/charts/styles.css';
import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/notifications/styles.layer.css';

import 'mantine-contextmenu/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import './layout.css';
import { ServerProvider } from '@/contexts/ServerContext';
import { AgentProvider } from '@/contexts/AgentContext';
import { AppProvider, useAppStatus } from '@/contexts/AppContext';
import { UIProvider, useUIStatus } from '@/contexts/UIContext';
import { LoggerProvider } from '@/contexts/LoggerContext';

export default function RootLayout({ children }: { children: any }) {
  const loggerEnabled = process.env.NEXT_PUBLIC_LOGGER_ENABLED === 'true';

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
        {!loggerEnabled && (
          <UIProvider>
            <AppProvider>
              <ServerProvider>
                <AgentProvider>
                  <LayoutWithTheme>
                    <ContextMenuProvider>{children}</ContextMenuProvider>
                  </LayoutWithTheme>
                </AgentProvider>
              </ServerProvider>
            </AppProvider>
          </UIProvider>
        )}
        {loggerEnabled && (
          <LoggerProvider>
            <UIProvider>
              <AppProvider>
                <ServerProvider>
                  <AgentProvider>
                    <LayoutWithTheme>
                      <ContextMenuProvider>{children}</ContextMenuProvider>
                    </LayoutWithTheme>
                  </AgentProvider>
                </ServerProvider>
              </AppProvider>
            </UIProvider>
          </LoggerProvider>
        )}
      </body>
    </html>
  );
}

// Componente che gestisce il tema dinamico
function LayoutWithTheme({ children }: { children: any }) {
  const { primaryColor, uiFontFamily, uiFontSize } = useUIStatus();

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
