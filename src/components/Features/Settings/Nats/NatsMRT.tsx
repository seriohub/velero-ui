'use client';

import { useMemo } from 'react';

import { Group, } from '@mantine/core';

import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import RestoreAction from '@/components/Features/Velero/Backups/Actions/RestoreAction';
import UpdateExpirationAction from '@/components/Features/Velero/Backups/Actions/UpdateExpirationAction';
import DownloadAction from '@/components/Features/Velero/Backups/Actions/DownloadAction';
import InspectAction from '@/components/Features/Velero/Backups/Actions/InspectAction';

import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';

export function NatsMRT({
                          fetching,
                          setReload,
                          items,
                          customActions
                        }: any) {

  const renderActions = (record: any) => (
    <Group gap={2} wrap="nowrap">
      <DescribeActionIcon resourceType="backup" record={record}/>
      <UpdateExpirationAction record={record} setReload={setReload}/>
      <DownloadAction record={record}/>
      <InspectAction record={record}/>
      <RestoreAction record={record} setReload={setReload}/>
      <DeleteAction resourceType="backup" record={record} setReload={setReload}/>
    </Group>
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'cid',
        header: 'cid'
      },
      {
        accessorKey: 'name',
        header: 'name',
      },
      {
        accessorKey: 'kind',
        header: 'kind',
      },
      {
        accessorKey: 'type',
        header: 'type',
      },
      {
        accessorKey: 'ip',
        header: 'ìp',
      },
      {
        accessorKey: 'port',
        header: 'port'
      },
      {
        accessorKey: 'start',
        header: 'start'
      },
      {
        accessorKey: 'last_activity',
        header: 'last_activity',
      },
      {
        accessorKey: 'rtt',
        header: 'rtt'
      },
      {
        accessorKey: 'uptime',
        header: 'uptime'
      },
      {
        accessorKey: 'idle',
        header: 'idle'
      },
      {
        accessorKey: 'pending_bytes',
        header: 'pending_bytes',
      },
      {
        accessorKey: 'in_msgs',
        header: 'in_msgs',
      },
      {
        accessorKey: 'out_msgs',
        header: 'out_msgs',
      },
      {
        accessorKey: 'in_bytes',
        header: 'in_bytes',
      },
      {
        accessorKey: 'out_bytes',
        header: 'out_bytes',
      },
      {
        accessorKey: 'subscriptions',
        header: 'subscriptions',
      },
      {
        accessorKey: 'lang',
        header: 'lang',
      },
      {
        accessorKey: 'version',
        header: 'version',
      },
    ],
    [],
  );

  return <GenericMRTTableLayout
    title='nats'
    fetching={fetching}
    items={items || []}
    setReload={setReload}
    columns={columns}
    renderRowActions={({ row }: { row: MRT_Row<any> }) => <>{renderActions(row?.original)}</>}
    customActions={customActions}
  />
}
