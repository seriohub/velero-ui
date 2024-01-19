'use client';

import '@mantine/core/styles.css';
// import '@mantine/core/styles.layer.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.layer.css';
// import './global.css'
// import './layout.css';

import React, { useState } from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { PublicEnvScript } from 'next-runtime-env';
import { theme } from '../theme';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';

export default function RootLayout({ children }: { children: any }) {
  const [appApiHistory, setAppApiHistory] = useState<Array<any>>([]);
  const [appRefreshDatatableAfter, setAppRefreshDatatableAfter] = useState<Number>(
    Number(`${process.env.NEXT_PUBLIC_REFRESH_DATATABLE_AFTER}`)
  );
  const [appRefreshRecent, setAppRefreshRecent] = useState<Number>(
    Number(`${process.env.NEXT_PUBLIC_REFRESH_RECENT}`)
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
                apiHistory: appApiHistory,
                refreshDatatableAfter: appRefreshDatatableAfter,
                refreshRecent: appRefreshRecent,
              },
              setApiHistory: setAppApiHistory,
              setRefreshDatatableAfter: setAppRefreshDatatableAfter,
              setRefreshRecent: setAppRefreshRecent,
            }}
          >
            {children}
          </VeleroAppContexts.Provider>
        </MantineProvider>
      </body>
    </html>
  );
}
