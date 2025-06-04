'use client';

import { useMemo } from 'react';
import { ActionIcon, Anchor, CopyButton, Group, Text, Tooltip, } from '@mantine/core';
import { IconCheck, IconCopy, IconDeviceFloppy, IconServer, } from '@tabler/icons-react';
import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { useRouter } from 'next/navigation';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';
import { highlightMultiple } from '@/utils/highlightMultiple';

export function PVBMRT({
                         fetching,
                         setReload,
                         items,
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
                  router.push(`/pod-volume-backups/${name}`);
                }}
              >
                <Text truncate="end">{highlightMultiple(name, highlights)}</Text>
              </Anchor>
            </Group>
          );
        },
      },
      {
        accessorKey: 'spec.tags.backup',
        header: 'From Backup',
        Cell: ({
                 row,
                 column,
                 table
               }) => {
          const backup = row.original?.spec?.tags?.backup ?? '';
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter]
            .map(h => h.toString().trim())
            .filter(Boolean);

          return (
            <Anchor
              size="sm"
              onClick={() => {
                router.push(`/backups/${backup}`);
              }}
            >
              <Group gap={5}>
                <IconDeviceFloppy size={16}/>
                <Text truncate="end">{highlightMultiple(backup, highlights)}</Text>
              </Group>
            </Anchor>
          );
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
        accessorKey: 'spec.backupStorageLocation',
        header: 'Storage Location',
        Cell: ({
                 row,
                 column,
                 table
               }) => {
          const location = row.original?.spec?.backupStorageLocation ?? '';
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter]
            .map(h => h.toString().trim())
            .filter(Boolean);

          return (
            <Anchor
              size="sm"
              onClick={() => {
                router.push(`/backup-storage-locations/${location}`);
              }}
            >
              <Group gap={5}>
                <IconServer size={16}/>
                <Text truncate="end">{highlightMultiple(location, highlights)}</Text>
              </Group>
            </Anchor>
          );
        },
      },
      {
        accessorKey: 'spec.tags.pod',
        header: 'Pod Name',
      },
      {
        accessorKey: 'spec.tags.volume',
        header: 'Volume'
      },

    ],
    [],
  );

  return <GenericMRTTableLayout
    name='pvb'
    fetching={fetching}
    items={items || []}
    setReload={setReload}
    columns={columns}
    initialState={{
      columnVisibility: {
        'spec.tags.pod': false,
      },
    }}
    renderRowActions={({ row }: { row: MRT_Row<any> }) => <>{renderActions(row?.original)}</>}
  />
}
