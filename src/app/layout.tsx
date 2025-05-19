import React from 'react';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';

import { env, PublicEnvScript } from 'next-runtime-env';

import '../styles/fonts.css';
import '@mantine/charts/styles.css';
import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/notifications/styles.layer.css';

import 'mantine-contextmenu/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import './layout.css';
import { ServerProvider } from '@/contexts/ServerContext';
import { AgentProvider } from '@/contexts/AgentContext';
import { AppProvider } from '@/contexts/AppContext';
import { UIProvider } from '@/contexts/UIContext';
import { LoggerProvider } from '@/contexts/LoggerContext';
import LayoutTheme from "@/app/layoutTheme";

import AppClientWrapper from "@/components/AppClientWrapper";

export default function RootLayout({ children }: { children: any }) {
  const loggerEnabled = env('NEXT_PUBLIC_LOGGER_ENABLED')?.toLocaleLowerCase() === 'true';

  return (
    <html lang="en" {...mantineHtmlProps}>
    <head>
      <PublicEnvScript nonce={{ headerKey: 'x-nonce' }}/>
      <ColorSchemeScript/>
      <title>VUI - Velero UI</title>
      <link rel="shortcut icon" href="/favicon.svg"/>
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
              <LayoutTheme><AppClientWrapper>{children}</AppClientWrapper></LayoutTheme>
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
                <LayoutTheme><AppClientWrapper>{children}</AppClientWrapper></LayoutTheme>
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
