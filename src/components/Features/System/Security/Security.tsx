'use client';

import { env } from 'next-runtime-env';

import React from 'react';
import { DataTable } from 'mantine-datatable';
import { MainStack } from '@/components/Commons/MainStack';

import { useDiagnosticAgent } from '@/hooks/diagnostic/useDiagnosticAgent';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { TableStatusItem } from './TableStatusItem';

export function Security() {
  const { reload, setReload } = useDiagnosticAgent();

  const elements = [
    {
      component: 'CORE',
      description: 'Running mode',
      value: 'N.A.',
    },
    {
      component: 'API',
      description: 'Running mode',
      value: 'N.A.',
    },
    {
      component: 'WATCHDOG',
      description: 'Running mode',
      value: 'N.A.',
    },
    {
      component: 'UI',
      description: 'Running mode',
      value: process.env.NODE_ENV,
      status: (
        <TableStatusItem
          label="Running mode"
          value={`${process.env.NODE_ENV}`}
          ok={process.env.NODE_ENV !== 'development'}
        />
      ),
    },
    {
      component: 'UI',
      description: 'Logger enabled',
      value: env('NEXT_PUBLIC_LOGGER_ENABLED')?.toLocaleLowerCase() === 'true' ? 'true' : 'false',
      status: (
        <TableStatusItem
          label="Logger Enabled"
          value={`${env('NEXT_PUBLIC_LOGGER_ENABLED')}`}
          ok={env('NEXT_PUBLIC_LOGGER_ENABLED')?.toLocaleLowerCase() !== 'true'}
        />
      ),
    },
    {
      component: 'UI/CORE - UI/API',
      description: 'HTTPS',
      value: location.protocol,
      status: (
        <TableStatusItem
          label="Logger Enabled"
          value={location.protocol}
          ok={location.protocol === 'https:'}
        />
      ),
    },
  ];

  return (
    <MainStack>
      <Toolbar title="Info" breadcrumbItem={[{ name: 'Security' }]}>
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>

      <DataTable
        withTableBorder
        striped
        columns={[
          {
            accessor: 'component',
            title: 'Component',
            width: 600,
          },
          {
            accessor: 'description',
            title: 'Description',
            sortable: true,
            width: 600,
            ellipsis: true,
          },
          {
            accessor: 'value',
            title: 'Value',
            sortable: true,
            width: 600,
            ellipsis: true,
          },
          {
            accessor: 'status',
            title: 'Status',
            sortable: true,
            width: 600,
            ellipsis: true,
          },
        ]}
        records={elements}
      />
    </MainStack>
  );
}
