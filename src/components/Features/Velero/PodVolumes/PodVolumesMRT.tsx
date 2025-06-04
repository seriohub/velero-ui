'use client';

import React, { useMemo } from 'react';
import { Anchor, Group, Text, } from '@mantine/core';
import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { useRouter } from 'next/navigation';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';
import { highlightMultiple } from '@/utils/highlightMultiple';

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
        accessorKey: 'metadata.name',
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
            <Anchor
              size="sm"
              onClick={() => {
                router.push(`/${routeType}/${name}`);
              }}
            >
              {highlightMultiple(name, highlights)}
            </Anchor>
          );
        },
      },
      {
        accessorKey: 'spec.pod.name',
        header: 'Pod Name',
      },
      {
        accessorKey: 'spec.tags.volume',
        header: 'Volume',
      },
      {
        accessorKey: 'status.phase',
        header: 'Phase',
        Cell: ({ row }) => (
          <VeleroResourceStatusBadge status={row.original?.status?.phase || undefined}/>
        ),
      },
      {
        accessorKey: 'status.progress',
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
        maxHeight: "calc(100% - 90px)",
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
