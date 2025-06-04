'use client';

import { useMemo } from 'react';
import { type MRT_ColumnDef, } from 'mantine-react-table';

import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';

export function PodEnvMRT({
                            name,
                            fetching,
                            setReload,
                            items,
                          }: any) {

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Environment variable',
      },
      {
        accessorKey: 'value',
        header: 'Value',
      },
    ],
    [],
  );

  return <GenericMRTTableLayout
    title={name}
    fetching={fetching}
    items={items || []}
    setReload={setReload}
    columns={columns}
    enableRowActions={false}
  />
}
