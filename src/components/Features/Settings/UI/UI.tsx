'use client';

import React, { useState } from 'react';

import { env } from 'next-runtime-env';

import { DataTable } from 'mantine-datatable';
import { useServerStatus } from '@/contexts/ServerContext';

import { MainStack } from '@/components/Commons/MainStack';
import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

export function UI() {
  const serverValues = useServerStatus();

  const [reload, setReload] = useState(1);

  const uiConfiguration = [
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
      value: serverValues.currentServer?.url,
    },
    {
      name: 'NEXT_PUBLIC_VELERO_API_WS',
      value: serverValues.currentServer?.ws,
    },
    {
      name: 'NEXT_PUBLIC_FRONT_END_BUILD_VERSION',
      value: env('NEXT_PUBLIC_FRONT_END_BUILD_VERSION'),
    },
    {
      name: 'NEXT_PUBLIC_FRONT_END_BUILD_DATE',
      value: env('NEXT_PUBLIC_FRONT_END_BUILD_DATE'),
    },
  ];

  return (
    <MainStack>
      <Toolbar title="Backup" breadcrumbItem={[{ name: 'UI' }]}>
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>
      <DataTable
        withTableBorder
        striped
        columns={[
          {
            accessor: 'name',
            title: 'Environment variable',

          },
          {
            accessor: 'key',
            title: 'value',
            render: (record: any) => <>{record.value}</>,
            sortable: true,

            ellipsis: true,
          },
        ]}
        records={uiConfiguration}
      />
    </MainStack>
  );
}
