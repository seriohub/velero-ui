'use client';

import { useMemo } from 'react';

import { Group } from '@mantine/core';
import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';

import InspectAction from '@/components/Features/Velero/Inspect/Actions/InspectAction';
import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';

export function InspectMRT({
                             fetching,
                             setReload,
                             items,
                           }: any) {

  const renderActions = (record: any) => (
    <Group gap={2} wrap="nowrap">
      <InspectAction record={record}/>
    </Group>
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Backups available',
      },
    ],
    [],
  );

  return <GenericMRTTableLayout
    title='inspect'
    fetching={fetching}
    items={items || []}
    setReload={setReload}
    columns={columns}
    renderRowActions={({ row }: { row: MRT_Row<any> }) => <>{renderActions(row?.original)}</>}
  />
}
