'use client';

import React, { useMemo } from 'react';
import { env } from 'next-runtime-env';
import { useServerStatus } from '@/contexts/ServerContext';

import { MainStack } from '@/components/Commons/MainStack';
import Toolbar from '@/components/Display/Toolbar';
import { PodEnvMRT } from '@/components/Features/Settings/PodEnvMRT';

export function UI() {
  const serverValues = useServerStatus();

  const uiConfiguration = useMemo(() => [
    {
      name: 'NEXT_PUBLIC_REFRESH_DATATABLE_AFTER',
      value: env('NEXT_PUBLIC_REFRESH_DATATABLE_AFTER'),
    },
    {
      name: 'NEXT_PUBLIC_REFRESH_RECENT',
      value: env('NEXT_PUBLIC_REFRESH_RECENT'),
    },
    {
      name: 'NEXT_PUBLIC_VELERO_API_URL',
      value: serverValues.currentServer?.url ?? 'N.A.',
    },
    {
      name: 'NEXT_PUBLIC_VELERO_API_WS',
      value: serverValues.currentServer?.ws ?? 'N.A.',
    },
    {
      name: 'NEXT_PUBLIC_FRONT_END_BUILD_VERSION',
      value: env('NEXT_PUBLIC_FRONT_END_BUILD_VERSION'),
    },
    {
      name: 'NEXT_PUBLIC_FRONT_END_BUILD_DATE',
      value: env('NEXT_PUBLIC_FRONT_END_BUILD_DATE'),
    },
    {
      name: 'NEXT_PUBLIC_CACHE_TTL',
      value: env('NEXT_PUBLIC_CACHE_TTL'),
    },
  ], [serverValues]);

  return (
    <MainStack>
      <Toolbar title="Backup" breadcrumbItem={[{ name: 'UI' }]}>
        <></>
      </Toolbar>
      
      <PodEnvMRT
        name="ui"
        fetching={false}
        setReload={() => {
        }}
        items={uiConfiguration}
      />
    </MainStack>
  );
}
