'use client';

import React, { useMemo } from 'react';
import { ActionIcon, Anchor, CopyButton, Group, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy, IconServer, } from '@tabler/icons-react';
import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { useRouter } from 'next/navigation';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';
import CreateBackupFromScheduleAction
  from '@/components/Features/Velero/Schedules/Action/CreateBackupFromScheduleAction';
import StartStopActionIcon from '@/components/Features/Velero/Schedules/StartStopActionIcon';
import EditScheduleAction from '@/components/Features/Velero/Schedules/Action/EditScheduleAction';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';
import { highlightMultiple } from '@/utils/highlightMultiple';

export function SchedulesMRT({
                               fetching,
                               setReload,
                               items,
                               customActions
                             }: any) {

  const router = useRouter();

  const renderActions = (record: any) => (
    <Group gap={4} wrap="nowrap">
      <DescribeActionIcon resourceType="schedule" record={record}/>
      <CreateBackupFromScheduleAction record={record}/>
      <StartStopActionIcon
        resourceName={record?.metadata?.name}
        paused={record?.spec?.paused === true}
      />
      <EditScheduleAction record={record} setReload={setReload}/>
      <DeleteAction resourceType="schedule" record={record} setReload={setReload}/>
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
          const name = row?.original?.metadata?.name ?? '';
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter].filter(Boolean);

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
                  router.push(`/schedules/${name}`);
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
        id: 'spec.schedule',
        accessorFn: (row) => row?.spec?.schedule ?? '',
        header: 'Schedules',
      },
      {
        id: 'status.lastBackup',
        accessorFn: (row) => row?.status?.lastBackup ?? '',
        header: 'Last Backups',
      },
      {
        id: 'spec.template.ttl',
        accessorFn: (row) => row?.spec?.template?.ttl ?? '',
        header: 'TTL',
      },
      {
        id: 'spec.template.storageLocation',
        accessorFn: (row) => row?.spec?.temaplte?.storageLocation ?? '',
        header: 'Storage Location',
        Cell: ({
                 row,
                 column,
                 table
               }) => {
          const storageLocation = row?.original?.spec?.template?.storageLocation ?? '';
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter].filter(Boolean);

          return (
            <>
              {storageLocation !== '' && (
                <Anchor
                  size="sm"
                  onClick={() => {
                    router.push(`/backup-storage-locations/${storageLocation}`);
                  }}
                >
                  <Group gap={5}>
                    <IconServer size={16}/>
                    {highlightMultiple(storageLocation, highlights)}
                  </Group>
                </Anchor>
              )}
            </>
          );
        },
      },
      {
        id: 'spec.template.defaultVolumesToFsBackup',
        accessorFn: (row) => (row?.spec?.template?.defaultVolumesToFsBackup ? 'True' : 'False'),
        header: 'File-system backup',
        Cell: ({ row }) => (
          <>{row?.original?.spec?.template?.defaultVolumesToFsBackup === true && (
            <VeleroResourceStatusBadge status="true"/>)}
            {row?.original?.spec?.template?.defaultVolumesToFsBackup !== true && (
              <VeleroResourceStatusBadge status="false"/>)}
          </>
        ),
      },
      {
        id: 'status',
        accessorFn: (row) => (row?.spec?.paused ? 'Paused' : 'Running'),
        header: 'Status',
        Cell: ({ row }) => (
          <VeleroResourceStatusBadge
            status={row?.original?.spec?.paused === true ? 'Paused' : 'Running'}
          />
        ),
        filterFn: 'equals',
        filterVariant: 'select',
        mantineFilterSelectProps: {
          data: ['Running', 'Paused'],
          clearable: true,
        },
      },
    ],
    [],
  );

  return <GenericMRTTableLayout
    name='schedules'
    fetching={fetching}
    items={items || []}
    setReload={setReload}
    columns={columns}
    initialState={{
      columnVisibility: {
        'spec.template.defaultVolumesToFsBackup': false,
      },
    }}
    renderRowActions={({ row }: { row: MRT_Row<any> }) => <>{renderActions(row?.original)}</>}
    customActions={customActions}
  />
}
