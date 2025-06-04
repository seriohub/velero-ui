import React from 'react';

import '../styles/fonts.css';
import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/charts/styles.css';
import '@mantine/notifications/styles.layer.css';
import 'mantine-react-table/styles.css';
import './layout.css';

import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { env, PublicEnvScript } from 'next-runtime-env';

import { ServerProvider } from '@/contexts/ServerContext';
import { AgentProvider } from '@/contexts/AgentContext';
import { AppProvider } from '@/contexts/AppContext';
import { UIProvider } from '@/contexts/UIContext';
import { LoggerProvider } from '@/contexts/LoggerContext';

import LayoutTheme from '@/app/layoutTheme';

import AppClientWrapper from '@/components/AppClientWrapper';

function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <AppProvider>
        <ServerProvider>
          <AgentProvider>
            <LayoutTheme>
              <AppClientWrapper>
                {children}
              </AppClientWrapper>
            </LayoutTheme>
          </AgentProvider>
        </ServerProvider>
      </AppProvider>
    </UIProvider>
  );
}

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
    {loggerEnabled ? (
      <LoggerProvider>
        <ProvidersWrapper>
          {children}
        </ProvidersWrapper>
      </LoggerProvider>
    ) : (
      <ProvidersWrapper>
        {children}
      </ProvidersWrapper>
    )}
    </body>
    </html>
  );
}
