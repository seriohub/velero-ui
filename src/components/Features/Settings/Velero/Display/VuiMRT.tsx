'use client';

import React, { useMemo } from 'react';

import { Group } from '@mantine/core';

import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';

import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';

import PodLogsActionIcon from '@/components/Features/Settings/Velero/Actions/PodLogsActionIcon';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';

export function VuiMRT({
                         fetching,
                         setReload,
                         items,
                       }: any) {

  const renderActions = (record: any) => (
    <Group gap={2} wrap="nowrap">
      <PodLogsActionIcon podName={record?.podName} target='vui'/>
    </Group>
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'type',
        header: 'Type',
      },
      {
        accessorKey: 'version',
        header: 'Version',
      },
      {
        accessorKey: 'podName',
        header: 'Pod Name',
      },
      {
        accessorKey: 'nodeName',
        header: 'Node Name',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ row }) => (
          <VeleroResourceStatusBadge status={row.original?.status}/>
        )

      },
      {
        accessorKey: 'restarts',
        header: 'Restarts',
      },
      {
        accessor: 'created',
        header: 'Created',
      },
      {
        accessorKey: 'ip',
        header: 'Ip',
      },
    ],
    [],
  );

  return <GenericMRTTableLayout
    title='vui'
    fetching={fetching}
    items={items || []}
    setReload={setReload}
    columns={columns}
    initialState={{
      columnVisibility: { created: false },
    }}
    renderRowActions={({ row }: { row: MRT_Row<any> }) => <>{renderActions(row?.original)}</>}
  />
}
