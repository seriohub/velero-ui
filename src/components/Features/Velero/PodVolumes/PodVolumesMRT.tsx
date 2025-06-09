'use client';

import React, { useMemo } from 'react';
import { ActionIcon, Anchor, CopyButton, Group, Text, Tooltip, } from '@mantine/core';
import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { useRouter } from 'next/navigation';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';
import { highlightMultiple } from '@/utils/highlightMultiple';
import { IconCheck, IconCopy } from '@tabler/icons-react';

function formatBytes(bytes: number, decimals = 0) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(decimals))}${sizes[i]}`;
}

export function PodVolumesMRT({
                                fetching,
                                setReload,
                                items,
                                type,
                              }: any) {

  const router = useRouter();

  const renderActions = (record: any) => (
    <Group gap={2} wrap="nowrap">
      <DescribeActionIcon resourceType="PodVolumeBackup" record={record}/>
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
          const name = row.original?.metadata?.name ?? '';
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter]
            .map(h => h.toString().trim())
            .filter(Boolean);

          const routeType = type === 'podvolumebackups' ? 'pod-volume-backups' : 'pod-volume-restores';

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
                  router.push(`/${routeType}/${name}`);
                }}
              >
                {highlightMultiple(name, highlights)}
              </Anchor>
            </Group>
          );
        },
      },
      {
        id: 'spec.pod.name',
        accessorFn: (row) => row?.spec?.pod?.name ?? '',
        header: 'Pod Name',
      },
      {
        id: 'spec.tags.volume',
        accessorFn: (row) => row?.spec?.tags?.volume ?? '',
        header: 'Volume',
      },
      {
        id: 'status.phase',
        accessorFn: (row) => row?.status?.phase ?? '',
        header: 'Phase',
        Cell: ({ row }) => (
          <VeleroResourceStatusBadge status={row.original?.status?.phase || undefined}/>
        ),
      },
      {
        id: 'status.progress',
        accessorFn: (row) => row?.status?.progress ?? '',
        header: 'Size',
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <>
            {row.original?.status?.progress?.totalBytes && (
              <Text c="dimmed" size="sm" ta="right">
                {row.original?.status?.phase !== 'Completed' && (
                  <>
                    {formatBytes(row.original?.status?.progress?.bytesDone)} /
                    {formatBytes(row.original?.status?.progress?.totalBytes)}
                  </>
                )}
                {row.original?.status?.phase === 'Completed' && (
                  <>{formatBytes(row.original?.status.progress.totalBytes)}</>
                )}
              </Text>
            )}
          </>
        ),
      },
    ],
    [],
  );

  return <GenericMRTTableLayout
    name='pod-volumes'
    fetching={fetching}
    items={items || []}
    setReload={setReload}
    columns={columns}
    renderRowActions={({ row }: { row: MRT_Row<any> }) => <>{renderActions(row?.original)}</>}
    mantinePaperPropsContent={{
      style: {
        height: "100%",
        border: '0px',
        borderRadius: '0px',
      }
    }}
    mantineTableContainerPropsContent={{
      style: {
        height: "calc(100% - 90px)",
        border: '0px',
        borderRadius: '0px',
      }
    }}
    border={false}
    enablePagination={false}
    enableBottomToolbar={false}
    enableGrouping={false}
  />
}
