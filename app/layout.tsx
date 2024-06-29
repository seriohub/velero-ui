'use client';

import React, { use, useEffect, useState } from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import { PublicEnvScript, env } from 'next-runtime-env';
import { theme } from '../theme';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';

import { VeleroApiConfig, loadVeleroApiConfigs } from '@/components/BackendApi';

import { ContextMenuProvider } from 'mantine-contextmenu';

import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/notifications/styles.layer.css';

import 'mantine-contextmenu/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import './layout.css';

export default function RootLayout({ children }: { children: any }) {
  const veleroApiConfigs: VeleroApiConfig[] = loadVeleroApiConfigs();
  const [appBackends, setAppBackends] = useState<Array<VeleroApiConfig>>(veleroApiConfigs);
  const [appCurrentBackend, setAppCurrentBackend] = useState<VeleroApiConfig>(veleroApiConfigs[0]);

  const [appApiRequest, setAppApiRequest] = useState<Array<any>>([]);
  const [appApiResponse, setAppApiResponse] = useState<Array<any>>([]);

  const [appSocketStatus, setAppSocketStatus] = useState<string>('');

  const [appNotificationHistory, setAppNotificationHistory] = useState<Array<any>>([]);

  const [appMessagesHistory, setAppMessagesHistory] = useState<Array<string>>([]);

  const NEXT_PUBLIC_REFRESH_DATATABLE_AFTER = env('NEXT_PUBLIC_REFRESH_DATATABLE_AFTER');
  const NEXT_PUBLIC_REFRESH_RECENT = env('NEXT_PUBLIC_REFRESH_RECENT');

  const [appRefreshDatatableAfter, setAppRefreshDatatableAfter] = useState<Number>(
    Number(`${NEXT_PUBLIC_REFRESH_DATATABLE_AFTER}`)
  );
  const [appRefreshRecent, setAppRefreshRecent] = useState<Number>(
    Number(`${NEXT_PUBLIC_REFRESH_RECENT}`)
  );

  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const clusterIndex =
      localStorage.getItem('cluster') &&
      Number(localStorage.getItem('cluster')) < veleroApiConfigs.length
        ? Number(localStorage.getItem('cluster'))
        : 0;
    setAppCurrentBackend(veleroApiConfigs[clusterIndex]);
    setInitialized(true);
  }, []);
  
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
          <VeleroAppContexts.Provider
            value={{
              state: {
                messagesHistory: appMessagesHistory,
                apiBackends: appBackends,
                currentBackend: appCurrentBackend,
                apiRequest: appApiRequest,
                apiResponse: appApiResponse,
                refreshDatatableAfter: appRefreshDatatableAfter,
                refreshRecent: appRefreshRecent,
                notificationHistory: appNotificationHistory,
                socketStatus: appSocketStatus,
              },
              setMessageHistory: setAppMessagesHistory,
              setApiBackends: setAppBackends,
              setCurrentBackend: setAppCurrentBackend,
              setApiRequest: setAppApiRequest,
              setApiResponse: setAppApiResponse,
              setRefreshDatatableAfter: setAppRefreshDatatableAfter,
              setRefreshRecent: setAppRefreshRecent,
              setNotificationHistory: setAppNotificationHistory,
              setSocketStatus: setAppSocketStatus,
            }}
          >
            <ContextMenuProvider>{initialized && children}</ContextMenuProvider>
          </VeleroAppContexts.Provider>
        </MantineProvider>
      </body>
    </html>
  );
}
