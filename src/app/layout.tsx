'use client';

import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import { env, PublicEnvScript } from 'next-runtime-env';

import { ContextMenuProvider } from 'mantine-contextmenu';

import '../styles/fonts.css';
import '@mantine/charts/styles.css';
import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/notifications/styles.layer.css';

import 'mantine-contextmenu/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import { theme } from '../../theme';

import './layout.css';
import { ServerProvider } from '@/contexts/ServerContext';
import { AgentProvider } from '@/contexts/AgentContext';
import { AppProvider } from '@/contexts/AppContext';
import { UIProvider, useUIStatus } from '@/contexts/UIContext';
import { LoggerProvider } from '@/contexts/LoggerContext';

export default function RootLayout({ children }: { children: any }) {
  const loggerEnabled = env('NEXT_PUBLIC_LOGGER_ENABLED')?.toLocaleLowerCase() === 'true';

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

// Theme dynamic component
function LayoutWithTheme({ children }: { children: any }) {
  const { primaryColor, uiFontFamily, uiFontSize } = useUIStatus();

  return (
    <MantineProvider
      theme={{
        ...theme,
        primaryColor: primaryColor || 'blue',
        //fontFamily: uiFontFamily.fontFamily?.style?.fontFamily,
        fontFamily: `${uiFontFamily.fontFamily}, sans-serif`,
        ...(uiFontSize !== undefined && { fontSizes: uiFontSize?.fontSize }),
        headings: {
          // Use default theme if you want to provide default Mantine fonts as a fallback
          fontFamily: `${uiFontFamily.fontFamily}, sans-serif`,
        },
      }}
    >
      <ContextMenuProvider>{children}</ContextMenuProvider>
    </MantineProvider>
  );
}
