'use client';

import React, { useMemo } from 'react';
import { ActionIcon, Anchor, Box, CopyButton, Group, Progress, Text, Tooltip, } from '@mantine/core';
import { IconCalendarTime, IconCheck, IconCopy, IconServer, } from '@tabler/icons-react';
import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { usePathname, useRouter } from 'next/navigation';

import { getExpirationString } from '@/utils/getExpirationString';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';
import { highlightMultiple } from '@/utils/highlightMultiple';

export function BackupRestoreStreamMRT({
                                         fetching,
                                         setReload,
                                         items,
                                         enableTopToolbar = false,
                                       }: any) {

  const router = useRouter();
  const pathname = usePathname();

  const renderActions = (record: any) => (
    <Group gap={2} wrap="nowrap">
      <DescribeActionIcon resourceType={record.kind.toLowerCase()} record={record}/>
      {record.kind.toLowerCase() === 'backup' && (
        <DeleteAction resourceType="backup" record={record} setReload={setReload}/>
      )}
    </Group>
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        id: 'kind',
        accessorFn: (row) => row?.kind ?? '',
        header: 'Kind',
      },
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
          const highlights = [globalFilter, columnFilter]
            .map(h => h.toString().trim())
            .filter(Boolean);

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
                <Text truncate="end">{highlightMultiple(name, highlights)}</Text>
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
                <IconCalendarTime size={16}/>
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
        Cell: ({ row }) => (
          <VeleroResourceStatusBadge status={row?.original?.status?.phase || undefined}/>
        ),
      },
      {
        id: 'status.progress.itemsBackedUp',
        accessorFn: (row) => row?.status?.progress?.itemsBackedUp ?? '',
        header: 'Progress',
        Cell: ({ row }) => {
          const progressValue =
            row?.original?.status?.progress?.itemsBackedUp ?? row?.original?.status?.progress?.itemsRestored;
          const totalValue = row?.original?.status?.progress?.totalItems;

          return (
            <>
              {progressValue && totalValue && (
                <Box w="100%">
                  <Tooltip label={`${Math.round((100 * Number(progressValue)) / Number(totalValue))}%`}>
                    <Progress.Root size={20}>
                      <Progress.Section
                        animated={Number(progressValue) / Number(totalValue) !== 1}
                        color="var(--mantine-primary-color-filled)"
                        value={(100 * Number(progressValue)) / Number(totalValue)}
                      >
                        <Progress.Label>
                          {Math.round((100 * Number(progressValue)) / Number(totalValue))}%
                        </Progress.Label>
                      </Progress.Section>
                    </Progress.Root>
                  </Tooltip>
                </Box>
              )}
            </>
          );
        }
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
        id: 'status.startTimestamp',
        accessorFn: (row) => row?.status?.startTimestamp ?? '',
        header: 'Start',
      },
      {
        id: 'status.completionTimestamp',
        accessorFn: (row) => row?.status?.completionTimestamp ?? '',
        header: 'Completion',
      },
      {
        id: 'status.expire_in',
        accessorFn: (row) => row?.status?.expire_in ?? '',
        header: 'Expires in',
        Cell: ({ row }: any) => getExpirationString(row?.original?.status?.expiration),
      },
    ],
    [],
  );

  return <Box
    style={{
      height: 253,
      transition: 'height 0.2s ease',
      boxShadow: '0 -2px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 999,
    }}
  >
    <GenericMRTTableLayout
      name='backups-restores'
      fetching={fetching}
      items={items || []}
      setReload={setReload}
      columns={columns}
      enablePagination={false}
      showLoading={false}
      initialState={{
        columnVisibility: {
          'status.startTimestamp': false,
          'status.completionTimestamp': false,
          'status.expire_in': false
        },
        density: 'xs',
      }}
      renderRowActions={({ row }: { row: MRT_Row<any> }) => <>{renderActions(row?.original)}</>}
      mantinePaperPropsContent={{
        style: {
          border: 'None',
        }
      }
      }
      mantineTableContainerPropsContent={{ style: { height: enableTopToolbar ? "196px" : "253px" } }}
      enableBottomToolbar={false}
      enableTopToolbar={enableTopToolbar}
    />
  </Box>

}
