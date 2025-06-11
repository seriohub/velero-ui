'use client';

import React, { useMemo } from 'react';
import { ActionIcon, Anchor, CopyButton, Group, Tooltip, } from '@mantine/core';
import { IconCalendarEvent, IconCheck, IconCopy, IconDeviceFloppy, } from '@tabler/icons-react';

import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';

import { useRouter } from 'next/navigation';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';

import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';
import { highlightMultiple } from '@/utils/highlightMultiple';

export function RestoresMRT({
                              fetching,
                              setReload,
                              items,
                            }: any) {

  const router = useRouter();

  const renderActions = (record: any) => (
    <Group gap={2} wrap="nowrap">
      <DescribeActionIcon resourceType="restore" record={record}/>
      <DeleteAction resourceType="restore" record={record} setReload={setReload}/>
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
                  router.push(`/restores/${name}`);
                }}
              >
                <Group gap={5}>
                  {highlightMultiple(name, highlights)}
                </Group>
              </Anchor>
            </Group>
          );
        },
      },
      {
        id: 'spec.backupName',
        accessorFn: (row) => row?.spec?.backupName ?? '',
        header: 'From Backup',
        Cell: ({
                 row,
                 column,
                 table
               }) => {
          const backupName = row?.original?.spec?.backupName ?? '';
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter].filter(Boolean);

          return (
            <Anchor
              size="sm"
              onClick={() => {
                router.push(`/backups/${backupName}`);
              }}
            >
              <Group gap={5}>
                <IconDeviceFloppy size={16}/>
                {highlightMultiple(backupName, highlights)}
              </Group>
            </Anchor>
          );
        },

      },
      {
        id: 'spec.scheduleName',
        accessorFn: (row) => row?.spec?.scheduleName ?? '',
        header: 'From Schedule',
        Cell: ({
                 row,
                 column,
                 table
               }) => {
          const scheduleName = row?.original?.spec?.scheduleName;
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter].filter(Boolean);

          if (!scheduleName) return null;

          return (
            <Anchor
              size="sm"
              onClick={() => {
                router.push(`/schedules/${scheduleName}`);
              }}
            >
              <Group gap={5}>
                <IconCalendarEvent size={16}/>
                {highlightMultiple(scheduleName, highlights)}
              </Group>
            </Anchor>
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
        id: 'status.startTimestamp',
        accessorFn: (row) => row?.status?.startTimestamp ?? '',
        header: 'Started',
      },
      {
        id: 'status.completionTimestamp',
        accessorFn: (row) => row?.status?.completionTimestamp ?? '',
        header: 'Completed',
        enableColumnFilter: false,
      },
      {
        id: 'status.errors',
        accessorFn: (row) => row?.status?.errors ?? '',
        header: 'Errors',
      },
      {
        id: 'status.warnings',
        accessorFn: (row) => row?.status?.warnings ?? '',
        header: 'Warnings',
      },
    ],
    [],
  );

  return <GenericMRTTableLayout
    name='restores'
    fetching={fetching}
    items={items || []}
    setReload={setReload}
    columns={columns}
    initialState={{
      columnVisibility: {
        'status.startTimestamp': false,
        'status.errors': false,
        'status.warnings': false,
      },
    }}
    renderRowActions={({ row }: { row: MRT_Row<any> }) => <>{renderActions(row?.original)}</>}
  />
}
