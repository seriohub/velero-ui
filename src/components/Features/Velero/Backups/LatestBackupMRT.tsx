import React, { useMemo } from 'react';
import {
  ActionIcon,
  Anchor,
  Box,
  Card,
  CopyButton,
  Group,
  Text,
  Tooltip,
  useComputedColorScheme,
} from '@mantine/core';
import { IconCalendarTime, IconCheck, IconCopy, IconServer } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';

import RestoreAction from '@/components/Features/Velero/Backups/Actions/RestoreAction';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';

import VeleroResourceStatusBadge from '../Commons/Display/VeleroResourceStatusBadge';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { highlightMultiple } from '@/utils/highlightMultiple';
import { getDurationInMilliseconds } from '@/utils/getDurationDetails';
import { getExpirationString } from '@/utils/getExpirationString';
import { get_duration } from '@/utils/getDuration';
import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';

interface BackupLatestProps {
  latest: Array<any>;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

export function LatestBackupMRT({
                                  setReload,
                                  latest = []
                                }: BackupLatestProps) {
  const router = useRouter();

  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const renderActions = (record: any) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <DescribeActionIcon resourceType="backup" record={record}/>
      {/*<LogsActionIcon resourceType="backup" record={record} />*/}
      <RestoreAction record={record} setReload={setReload}/>
      <DeleteAction resourceType="backup" record={record} setReload={setReload}/>
    </Group>
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        id: 'metadata.name',
        accessorFn: (row) => row.metadata?.name ?? '',
        header: 'Name',
        Cell: ({
                 row,
                 column,
                 table
               }) => {
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter].filter(Boolean);
          const name = row.original?.metadata?.name ?? '';

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
        accessorFn: (row) => row.metadata?.labels?.['velero.io/schedule-name'] ?? '',
        header: 'Schedule',
        Cell: ({
                 row,
                 column,
                 table
               }) => {
          const scheduleName = row.original.metadata.labels?.['velero.io/schedule-name'];
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter].filter(Boolean);

          if (!scheduleName) return null;

          const highlighted = highlightMultiple(scheduleName, highlights);

          return (
            <Anchor
              size="sm"
              onClick={() => router.push(`/schedules/${scheduleName}`)}
            >
              <Group gap={5}>
                <IconCalendarTime size={16}/>
                {highlighted}
              </Group>
            </Anchor>
          )
        },
      },
      {
        accessorKey: 'status.phase',
        header: 'Status',
        Cell: ({
                 row
               }) => (
          <VeleroResourceStatusBadge status={row.original.status?.phase || undefined}/>
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
        header: 'Warnings',
      },
      {
        id: 'metadata.creationTimestamp',
        accessorFn: (row) => row?.metadata?.creationTimestamp ?? '',
        header: 'Created',
      },
      {
        id: 'status.completionTimestamp',
        accessorFn: (row) => row?.metadata?.completionTimestamp ?? '',
        header: 'Completation',
      },
      {
        id: 'duration',
        accessorFn: (row) => Number(getDurationInMilliseconds(row.status?.startTimestamp, row.status?.completionTimestamp)),
        header: 'Duration',
        enableColumnFilter: false,
        Cell: ({
                 row
               }) => (
          <>
            {get_duration(row.original.status)}
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
            <Tooltip label={row.original.status?.expiration} offset={5}>
              <Text size="sm">{getExpirationString(row.original.status?.expiration)}</Text>
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
          const storageLocation = row.original?.spec?.storageLocation ?? '';

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

  return (
    <Card
      withBorder
      p="md"
      radius="md"
      shadow="sm"
      h={310}
      bg={
        computedColorScheme === 'light'
          ? 'var(--mantine-color-white)'
          : 'var(--mantine-color-dark-6)'
      }
    >
      <Card.Section p={0}>
        <Box
          style={{
            height: 310,
            transition: 'height 0.2s ease',
            boxShadow: '0 -2px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 999,
          }}
        >
          <GenericMRTTableLayout
            name='latest'
            title='Recent Backups – last 24 hours or top 10'
            items={latest || []}
            setReload={setReload}
            columns={columns}
            enablePagination={false}
            enableBottomToolbar={false}
            enableRefreshButton={false}
            initialState={{
              columnVisibility: {
                'metadata.creationTimestamp': false,
                'duration': false,
                'status.errors': false,
                'status.warnings': false,
              },
              density: 'xs',
            }}
            mantineTableContainerPropsContent={{ style: { height: "252px" } }}
            mantinePaperPropsContent={{
              style: {
                border: 'None',
              }
            }}
            renderRowActions={({ row }: { row: MRT_Row<any> }) => <>{renderActions(row?.original)}</>}
          />
        </Box>
      </Card.Section>
    </Card>
  );
}
