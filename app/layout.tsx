'use client';

import React, { useState } from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import { PublicEnvScript, env } from 'next-runtime-env';
import { theme } from '../theme';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';

import { ContextMenuProvider } from 'mantine-contextmenu';

import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/notifications/styles.layer.css';

import 'mantine-contextmenu/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import './layout.css';

export default function RootLayout({ children }: { children: any }) {
  const [appApiRequest, setAppApiRequest] = useState<Array<any>>([]);
  const [appApiResponse, setAppApiResponse] = useState<Array<any>>([]);

  const [appNotificationHistory, setAppNotificationHistory] = useState<Array<any>>([]);

  const NEXT_PUBLIC_REFRESH_DATATABLE_AFTER = env('NEXT_PUBLIC_REFRESH_DATATABLE_AFTER');
  const NEXT_PUBLIC_REFRESH_RECENT = env('NEXT_PUBLIC_REFRESH_RECENT');

  const [appRefreshDatatableAfter, setAppRefreshDatatableAfter] = useState<Number>(
    Number(`${NEXT_PUBLIC_REFRESH_DATATABLE_AFTER}`)
  );
  const [appRefreshRecent, setAppRefreshRecent] = useState<Number>(
    Number(`${NEXT_PUBLIC_REFRESH_RECENT}`)
  );

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
                apiRequest: appApiRequest,
                apiResponse: appApiResponse,
                refreshDatatableAfter: appRefreshDatatableAfter,
                refreshRecent: appRefreshRecent,
                notificationHistory: appNotificationHistory,
              },
              setApiRequest: setAppApiRequest,
              setApiResponse: setAppApiResponse,
              setRefreshDatatableAfter: setAppRefreshDatatableAfter,
              setRefreshRecent: setAppRefreshRecent,
              setNotificationHistory: setAppNotificationHistory,
            }}
          >
            <ContextMenuProvider>{children}</ContextMenuProvider>
          </VeleroAppContexts.Provider>
        </MantineProvider>
      </body>
    </html>
  );
}
