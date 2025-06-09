'use client';

import React, { useMemo } from 'react';
import { ActionIcon, Anchor, CopyButton, Group, Text, Tooltip } from '@mantine/core';
import { IconCheck, IconClock, IconCopy, IconServer, } from '@tabler/icons-react';
import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { usePathname, useRouter } from 'next/navigation';

import { getExpirationString } from '@/utils/getExpirationString';
import { getDurationInMilliseconds } from '@/utils/getDurationDetails';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import RestoreAction from '@/components/Features/Velero/Backups/Actions/RestoreAction';
import UpdateExpirationAction from '@/components/Features/Velero/Backups/Actions/UpdateExpirationAction';
import DownloadAction from '@/components/Features/Velero/Backups/Actions/DownloadAction';
import InspectAction from '@/components/Features/Velero/Backups/Actions/InspectAction';
import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';
import { highlightMultiple } from '@/utils/highlightMultiple';
import { get_duration } from '@/utils/getDuration';

export function BackupsMRT({
                             fetching,
                             setReload,
                             items,
                             customActions
                           }: any) {

  const router = useRouter();
  const pathname = usePathname();

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
        id: 'metadata.name',
        accessorFn: (row) => row?.metadata?.name ?? '',
        header: 'Name',
        Cell: ({
                 row,
                 column,
                 table
               }) => {
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter].filter(Boolean);
          const name = row?.original?.metadata?.name ?? '';

          return (
            <Group gap={5}>
              <CopyButton value={name} timeout={2000}>
                {({
                    copied,
                    copy
                  }) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy backup name'} withArrow position="right">
                    <ActionIcon
                      color={copied ? 'teal' : 'var(--mantine-primary-color-filled)'}
                      variant="light"
                      size="sm"
                      onClick={copy}
                      p={0}
                      m={0}
                    >
                      {copied ? <IconCheck size={14}/> : <IconCopy size={16}/>}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
              <Anchor
                size="sm"
                onClick={() => {
                  router.push(`/backups/${name}`);
                }}
              >
                {highlightMultiple(name, highlights)}
              </Anchor>
            </Group>
          );
        },

      },
      {
        id: 'scheduleName',
        accessorFn: (row) => row?.metadata?.labels?.['velero.io/schedule-name'] ?? '',
        header: 'Schedule',
        Cell: ({
                 row,
                 column,
                 table
               }) => {
          const scheduleName = row?.original?.metadata?.labels?.['velero.io/schedule-name'];
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter].filter(Boolean);

          if (!scheduleName) return null;

          const highlighted = highlightMultiple(scheduleName, highlights);

          return pathname !== `/schedules/${scheduleName}` ? (
            <Anchor
              size="sm"
              onClick={() => router.push(`/schedules/${scheduleName}`)}
            >
              <Group gap={5}>
                <IconClock size={16}/>
                {highlighted}
              </Group>
            </Anchor>
          ) : (
            <Text size="sm" truncate="end">
              {highlighted}
            </Text>
          );
        },
      },
      {
        id: 'status.phase',
        accessorFn: (row) => row?.status?.phase ?? '',
        header: 'Status',
        Cell: ({
                 row
               }) => (
          <VeleroResourceStatusBadge status={row?.original?.status?.phase || undefined}/>
        ),
      },
      {
        id: 'status.errors',
        accessorFn: (row) => row?.status?.errors ?? '',
        header: 'Errors',
      },
      {
        id: 'status.warnings',
        accessorFn: (row) => row?.status?.warnings ?? '',
        header: 'Warnings'
      },
      {
        id: 'metadata.creationTimestamp',
        accessorFn: (row) => row?.metadata?.creationTimestamp ?? '',
        header: 'Created',
      },
      {
        id: 'duration',
        accessorFn: (row) => Number(getDurationInMilliseconds(row?.status?.startTimestamp, row?.status?.completionTimestamp)),
        header: 'Duration',
        enableColumnFilter: false,
        Cell: ({
                 row
               }) => (
          <>
            {get_duration(row?.original?.status)}
          </>
        ),

      },
      {
        id: 'status.expiration',
        accessorFn: (row) => row?.status?.expiration ?? '',
        header: 'Expires in',
        enableColumnFilter: false,
        Cell: ({
                 row
               }) => (
          <>
            <Tooltip label={row?.original?.status?.expiration} offset={5}>
              <Text size="sm">{getExpirationString(row?.original?.status?.expiration)}</Text>
            </Tooltip>
          </>
        ),
      },
      {
        id: 'spec.storageLocation',
        accessorFn: (row) => row?.spec?.storageLocation ?? '',
        header: 'Storage Location',
        Cell: ({
                 row,
                 column,
                 table
               }) => {
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const storageLocation = row?.original?.spec?.storageLocation ?? '';

          const highlights = [globalFilter, columnFilter].filter(Boolean);

          return (
            <Anchor
              size="sm"
              onClick={() => {
                router.push(`/backup-storage-locations/${storageLocation}`);
              }}
            >
              <Group gap={5}>
                <IconServer size={16}/>
                <Text truncate="end">
                  {highlightMultiple(storageLocation, highlights)}
                </Text>
              </Group>
            </Anchor>
          );
        },
      },
    ],
    [],
  );

  return <GenericMRTTableLayout
    name='backups'
    fetching={fetching}
    items={items || []}
    setReload={setReload}
    columns={columns}
    initialState={{
      columnVisibility: {
        'metadata.creationTimestamp': false,
        'status.errors': false,
        'status.warnings': false,
      },
    }}
    renderRowActions={({ row }: { row: MRT_Row<any> }) => <>{renderActions(row?.original)}</>}
    customActions={customActions}
  />
}
