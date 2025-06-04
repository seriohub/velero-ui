'use client';

import { useMemo } from 'react';

import { type MRT_ColumnDef } from 'mantine-react-table';

import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';
import { Group } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

export function WatchdogEnvMRT({
                                 fetching,
                                 setReload,
                                 items,
                               }: any) {
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'hasChanged',
        header: 'Need restart',
        Cell: ({ row }) => (
          <>
            <Group gap={5}>
              {row.original?.hasChanged && (
                <IconAlertTriangle size={20} color="var(--mantine-primary-color-light-color)"/>
              )}
            </Group>
          </>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Environment variable',
      },
      {
        accessorKey: 'value',
        header: 'Value',
      },
      {
        accessorKey: 'newValue',
        header: 'New value',
      },
    ],
    [],
  );

  return <GenericMRTTableLayout
    title="watchdog"
    fetching={fetching}
    items={items || []}
    setReload={setReload}
    columns={columns}
    enableRowActions={false}
  />
}
