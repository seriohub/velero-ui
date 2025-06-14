'use client';

import React, { useMemo } from 'react';
import { ActionIcon, Anchor, CopyButton, Group, Text, Tooltip, } from '@mantine/core';
import { IconCheck, IconCopy, } from '@tabler/icons-react';
import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { useRouter } from 'next/navigation';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';
import CredentialActionIcon from '@/components/Features/Velero/Commons/Actions/CredentialActionIcon';
import EditVslAction from '@/components/Features/Velero/SnapshotLocations/Actions/EditVSLAction';
import { highlightMultiple } from '@/utils/highlightMultiple';

export function VslMRT({
                         fetching,
                         setReload,
                         items,
                         customActions
                       }: any) {

  const router = useRouter();

  const renderActions = (record: any) => (
    <Group gap={2} wrap="nowrap">
      <CredentialActionIcon name={record.metadata.name} record={record}/>
      <DescribeActionIcon resourceType={record.kind} record={record}/>
      <EditVslAction record={record} setReload={setReload}/>
      <DeleteAction resourceType="vsl" record={record} setReload={setReload}/>
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
                  router.push(`/volume-snapshot-locations/${name}`);
                }}
              >
                <Group gap={5}>

                  <Text truncate="end">
                    {highlightMultiple(name, highlights)}
                  </Text>
                </Group>
              </Anchor>
            </Group>
          );
        },
      },
      {
        id: 'spec.provider',
        accessorFn: (row) => row?.spec?.provider ?? '',
        header: 'Provider',
      },
      {
        id: 'spec.credential.name',
        accessorFn: (row) => row?.credential?.name ?? '',
        header: 'Cred. Secret Name',
        Cell: ({
                 row,
                 column,
                 table
               }) => {
          const name = row?.original?.spec?.credential?.name ?? '';
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter]
            .map(h => h.toString().trim())
            .filter(Boolean);

          return name ? <>{highlightMultiple(name, highlights)}</> : null;
        },
      },
      {
        id: 'spec.credential.key',
        accessorFn: (row) => row?.spec?.credential?.key ?? '',
        header: 'Key Name',
        Cell: ({
                 row,
                 column,
                 table
               }) => {
          const key = row.original?.spec?.credential?.key ?? '';
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter]
            .map(h => h.toString().trim())
            .filter(Boolean);

          return key ? <>{highlightMultiple(key, highlights)}</> : null;
        },

      },
    ],
    [],
  );

  return <GenericMRTTableLayout
    name='vsl'
    fetching={fetching}
    items={items || []}
    setReload={setReload}
    columns={columns}
    renderRowActions={({ row }: { row: MRT_Row<any> }) => <>{renderActions(row?.original)}</>}
    customActions={customActions}
  />
}
